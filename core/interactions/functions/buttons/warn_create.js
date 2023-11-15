const { EmbedBuilder } = require('discord.js')

const { getUserWarns } = require("../../../database/schemas/Warns")
const { spamTimeoutMap } = require("../../../database/schemas/Strikes")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[2]
    const id_executor = interaction.user.id
    const operacao = parseInt(dados.split(".")[1])

    const member_guild = await client.getMemberGuild(interaction, id_alvo)

    if (operacao === 0) // Operação cancelada
        return client.reply(interaction, {
            content: ":octagonal_sign: | A inclusão da advertência foi cancelada",
            embeds: [],
            components: [],
            ephemeral: true
        })

    const alvo = await client.getUser(id_alvo)

    // Acrescentando mais uma advertência ao usuário e registrando o último moderador
    const user_warns = await getUserWarns(id_alvo, interaction.guild.id)
    user_warns.total++
    user_warns.assigner = interaction.user.id

    await user_warns.save()

    const guild = await client.getGuild(interaction.guild.id)
    let texto_rodape = "Se você receber mais advertências a ponto de atingir o limite, a penalidade será aplicada."

    if (guild.warn.cases >= user_warns.total)
        texto_rodape = `Você foi penalizado no servidor ${interaction.guild.name} devido a advertências recebidas.`

    const embed_user = new EmbedBuilder()
        .setTitle("> Uma advertência! :inbox_tray:")
        .setColor(0xED4245)
        .setDescription(`Você recebeu uma advertência do servidor ${interaction.guild.name}!\n\`\`\`fix\n📠 | Descrição fornecida:\n\n${user_warns.relatory}\`\`\``)
        .addFields(
            {
                name: `**${client.defaultEmoji("guard")} Aplicador da punição**`,
                value: `${client.emoji("icon_id")} \`${id_executor}\`\n( <@${id_executor}> )`,
                inline: true
            },
            {
                name: `**${client.emoji(47)} Advertências em registro**`,
                value: `\`${user_warns.total} / ${guild.warn.cases}\``,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **Penalidade do servidor**`,
                value: `\`${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}\`${guild.warn.action === "member_mute" ? `\n${client.defaultEmoji("time")} **${client.tls.phrase(user, "mode.spam.tempo")}: \`${spamTimeoutMap[guild.warn.timeout][1]}\`**` : ""}`,
                inline: true
            }
        )
        .setFooter({
            text: texto_rodape,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    // Avisando o usuário sobre a advertência
    await client.sendDM(alvo, { embed: embed_user }, true)

    // Enviando um embed para o servidor
    let descricao_warn = `Um usuário recebeu uma nova advertência!`

    if (guild.warn.cases >= user_warns.total)
        descricao_warn += `\n\n${client.emoji("banidos")} Ele atingiu o limite de advertências do servidor, a punição foi aplicada!`

    const embed_guild = new EmbedBuilder()
        .setTitle("> Uma advertência! :inbox_tray:")
        .setColor(0xED4245)
        .setDescription(`${descricao_warn}!\n\`\`\`fix\n📠 | Descrição fornecida:\n\n${user_warns.relatory}\`\`\``)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${id_alvo}\`\n( <@${id_alvo}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "mode.logger.entrada_original")}**`,
                value: `<t:${parseInt(member_guild.joinedTimestamp / 1000)}:F> )`,
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true }
        )
        .addFields(
            {
                name: `**${client.defaultEmoji("guard")} Aplicador da punição**`,
                value: `${client.emoji("icon_id")} \`${id_executor}\`\n( <@${id_executor}> )`,
                inline: true
            },
            {
                name: `**${client.emoji(47)} Advertências em registro**`,
                value: `\`${user_warns.total} / ${guild.warn.cases}\``,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **Penalidade do servidor**`,
                value: `\`${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}\`${guild.warn.action === "member_mute" ? `\n${client.defaultEmoji("time")} **${client.tls.phrase(user, "mode.spam.tempo")}: \`${spamTimeoutMap[guild.warn.timeout][1]}\`**` : ""}`,
                inline: true
            }
        )
        .setFooter({
            text: texto_rodape,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    client.notify(guild.warn.channel, { content: "@here", embeds: [embed_guild] })

    // Usuário ultrapassou a quantidade de advertências permitida no servidor
    if (user_warns.total >= guild.warn.cases) {

        // Aplicando a punição ao usuario
        const guild_member = await client.getMemberPermissions(interaction.guild.id, id_alvo)
        const guild_executor = await client.getMemberPermissions(interaction.guild.id, interaction.user.id)
        const bot_member = await client.getMemberPermissions(interaction.guild.id, client.id())

        require(`../../../events/warn/${guild.warn.action.replace("_2", "")}`)({ client, user, interaction, guild, user_warns, guild_member, guild_executor, bot_member })
    }

    return client.reply(interaction, {
        content: ":inbox_tray: | A advertência foi registrada no servidor!",
        embeds: [],
        components: [],
        ephemeral: true
    })
}