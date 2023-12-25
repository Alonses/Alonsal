const { EmbedBuilder } = require('discord.js')

const { getUserWarns } = require("../../../database/schemas/Warns")
const { spamTimeoutMap } = require("../../../database/schemas/Strikes")
const { loggerMap } = require("../../../database/schemas/Guild")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[2]
    const id_executor = interaction.user.id
    const operacao = parseInt(dados.split(".")[1])

    const member_guild = await client.getMemberGuild(interaction, id_alvo)

    if (operacao === 0) // Operação cancelada
        return client.reply(interaction, {
            content: client.tls.phrase(user, "mode.warn.advertencia_cancelada", client.emoji(0)),
            embeds: [],
            components: [],
            ephemeral: true
        })

    const user_alvo = await client.getUser(id_alvo)

    // Acrescentando mais uma advertência ao usuário e registrando o último moderador
    const user_warns = await getUserWarns(id_alvo, interaction.guild.id)
    user_warns.total++
    user_warns.assigner = interaction.user.id

    await user_warns.save()

    const guild = await client.getGuild(interaction.guild.id)
    let texto_rodape = client.tls.phrase(user_alvo, "mode.warn.aviso_penalidade")
    let acao_advertencia, tempo_mute = 0, punicao = guild.warn.action

    if (guild.warn.cases >= user_warns.total || guild.warn.progressive)
        texto_rodape = client.replace(client.tls.phrase(user_alvo, "mode.warn.aviso_penalidade_aplicada"), interaction.guild.name)

    if (user_warns.total >= guild.warn.cases)
        acao_advertencia = client.tls.phrase(user, `menu.events.${guild.warn.action}`)
    else if (guild.warn.progressive) {
        acao_advertencia = client.tls.phrase(user, `menu.events.${guild.warn.warned}`)
        punicao = guild.warn.warned
    } else {
        acao_advertencia = "Sem penalidades."
        punicao = "message_edit"
    }

    const embed_user = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user_alvo, "mode.warn.titulo_advertencia")} :inbox_tray:`)
        .setColor(0xED4245)
        .setDescription(client.replace(client.tls.phrase(user_alvo, "mode.warn.advertencia_recebida"), [interaction.guild.name, user_warns.relatory]))
        .addFields(
            {
                name: `${client.defaultEmoji("guard")} **Moderador responsável**`,
                value: `${client.emoji("icon_id")} \`${id_executor}\`\n\`${interaction.user.username}\`\n( <@${id_executor}> )`,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **Punição**`,
                value: `${loggerMap[punicao]}**${acao_advertencia}**`,
                inline: true
            },
            {
                name: `${client.emoji(47)} **Advertências: ${user_warns.total} / ${guild.warn.cases}**`,
                value: "⠀",
                inline: true
            }
        )
        .setFooter({
            text: texto_rodape,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    // Avisando o usuário sobre a advertência
    await client.sendDM(user_alvo, { embed: embed_user }, true)

    // Enviando um embed para o servidor
    const embed_guild = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(guild, "mode.warn.titulo_advertencia")} :inbox_tray:`)
        .setColor(0xED4245)
        .setDescription(`${client.tls.phrase(guild, "mode.warn.usuario_nova_advertencia")}!\n\`\`\`fix\n📠 | ${client.tls.phrase(guild, "mode.warn.descricao_fornecida")}\n\n${user_warns.relatory}\`\`\``)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${id_alvo}\`\n\`${user_warns.nick}\`\n( <@${id_alvo}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "mode.logger.entrada_original")}**`,
                value: `<t:${parseInt(member_guild.joinedTimestamp / 1000)}:F>`,
                inline: true
            },
            {
                name: `${client.emoji(47)} **Advertências: ${user_warns.total} / ${guild.warn.cases}**`,
                value: "⠀",
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.defaultEmoji("guard")} **Moderador responsável**`,
                value: `${client.emoji("icon_id")} \`${id_executor}\`\n\`${interaction.user.username}\`\n( <@${id_executor}> )`,
                inline: true
            }
        )
        .setTimestamp()

    if (guild.warn.timed) { // Advertência com prazo de expiração
        embed_guild.addFields({
            name: `${client.defaultEmoji("time")} **Expiração**`,
            value: `**Será removida em \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.reset]}`)}\`**\n( <t:${client.timestamp() + spamTimeoutMap[guild.warn.reset]}:f> )`,
            inline: true
        })
            .setFooter({
                text: "Você pode desligar a expiração de advertências no /painel guild pela guia de \"🛑 Advertências\"",
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })
    } else
        embed_guild.addFields(
            {
                name: "⠀",
                value: "⠀",
                inline: true
            }
        )

    embed_guild.addFields({
        name: `${client.emoji("banidos")} **Punição**`,
        value: `${loggerMap[punicao]}**${acao_advertencia}**`,
        inline: true
    })

    const obj = {
        embeds: [embed_guild]
    }

    if (guild.warn.notify) // Servidor com ping de advertência ativado
        obj.content = "@here"

    client.notify(guild.warn.channel, obj)

    // Usuário ultrapassou a quantidade de advertências permitida no servidor
    if (user_warns.total >= guild.warn.cases || guild.warn.progressive) {

        // Aplicando a punição ao usuario
        const guild_member = await client.getMemberPermissions(interaction.guild.id, id_alvo)
        const guild_executor = await client.getMemberPermissions(interaction.guild.id, interaction.user.id)
        const bot_member = await client.getMemberPermissions(interaction.guild.id, client.id())

        if (user_warns.total >= guild.warn.cases) // Atingiu o limite de advertências do servidor
            require(`../../../events/warn/${guild.warn.action.replace("_2", "")}`)({ client, user, interaction, guild, user_warns, guild_member, guild_executor, bot_member })
        else // Penalidades por advertências recebidas
            require(`../../../events/warn/${guild.warn.warned.replace("_2", "")}`)({ client, user, interaction, guild, user_warns, guild_member, guild_executor, bot_member })
    }

    return client.reply(interaction, {
        content: `:inbox_tray: | ${client.tls.phrase(user, "mode.warn.advertencia_registrada")}`,
        embeds: [],
        components: [],
        ephemeral: true
    })
}