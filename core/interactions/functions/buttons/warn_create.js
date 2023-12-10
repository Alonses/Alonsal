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
            content: client.tls.phrase(user, "mode.warn.advertencia_cancelada", client.emoji(0)),
            embeds: [],
            components: [],
            ephemeral: true
        })

    const user_alvo = await client.getUser(id_alvo)
    let penalidades_server = "", info_advertencia

    // Acrescentando mais uma advertência ao usuário e registrando o último moderador
    const user_warns = await getUserWarns(id_alvo, interaction.guild.id)
    user_warns.total++
    user_warns.assigner = interaction.user.id

    await user_warns.save()

    const guild = await client.getGuild(interaction.guild.id)
    let texto_rodape = client.tls.phrase(user_alvo, "mode.warn.aviso_penalidade")

    if (guild.warn.cases >= user_warns.total || guild.warn.progressive)
        texto_rodape = client.replace(client.tls.phrase(user_alvo, "mode.warn.aviso_penalidade_aplicada"), interaction.guild.name)

    if (user_warns.total >= guild.warn.cases)
        info_advertencia = `Essa advertência resultou em "${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}".`
    else if (guild.warn.progressive)
        info_advertencia = `Essa advertência resultou em "${client.tls.phrase(user, `menu.events.${guild.warn.warned}`)}".`
    else
        info_advertencia = `Essa advertência não teve penalidades.`

    info_advertencia = `\`\`\`fix\n${info_advertencia}\`\`\``

    // Penalidades do servidor
    if (guild.warn.progressive)
        penalidades_server = `${client.emoji("dancando_mod")} **Por advertência:**\n\`${client.tls.phrase(user, `menu.events.${guild.warn.warned}`)}\`\n`

    penalidades_server += `${client.emoji("banidos")} **Final:**\n\`${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}\``

    const embed_user = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user_alvo, "mode.warn.titulo_advertencia")} :inbox_tray:`)
        .setColor(0xED4245)
        .setDescription(client.replace(client.tls.phrase(user_alvo, "mode.warn.advertencia_recebida"), [interaction.guild.name, user_warns.relatory]), info_advertencia)
        .addFields(
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user_alvo, "mode.warn.aplicador_punicao")}**`,
                value: `${client.emoji("icon_id")} \`${id_executor}\`\n\`${interaction.user.username}\`\n( <@${id_executor}> )`,
                inline: true
            },
            {
                name: `${client.emoji(47)} **${client.tls.phrase(user_alvo, "mode.warn.advertencias_em_registro")}**`,
                value: `\`${user_warns.total} / ${guild.warn.cases}\``,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **${client.tls.phrase(user_alvo, "mode.warn.penalidade_server")}**`,
                value: penalidades_server,
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
    let descricao_warn = client.tls.phrase(guild, "mode.warn.usuario_nova_advertencia")

    if (guild.warn.cases >= user_warns.total)
        descricao_warn += `\n\n${client.emoji("banidos")} ${client.tls.phrase(guild, "mode.warn.usuario_punicao_aplicada")}`

    if (user_warns.total >= guild.warn.cases)
        info_advertencia = `Essa advertência resultou em "${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}".`
    else if (guild.warn.progressive)
        info_advertencia = `Essa advertência resultou em "${client.tls.phrase(user, `menu.events.${guild.warn.warned}`)}".`
    else
        info_advertencia = `Essa advertência não teve penalidades ao membro.`

    info_advertencia = `\`\`\`fix\n${info_advertencia}\`\`\``

    if (guild.warn.timed) // Servidor com tempo definido para remoção da advertência
        info_advertencia += `\n${client.defaultEmoji("time")} | Essa advertência será removida de forma automática <t:${client.timestamp() + spamTimeoutMap[guild.warn.reset]}:R>!\n( <t:${client.timestamp() + spamTimeoutMap[guild.warn.reset]}:f> )\nVocê pode desligar a remoção de advertências automática no </panel guild:1107163338930126869> pela guia de \`🛑 Advertências\``

    const embed_guild = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(guild, "mode.warn.titulo_advertencia")} :inbox_tray:`)
        .setColor(0xED4245)
        .setDescription(`${descricao_warn}!\n\`\`\`fix\n📠 | ${client.tls.phrase(guild, "mode.warn.descricao_fornecida")}\n\n${user_warns.relatory}\`\`\`${info_advertencia}`)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${id_alvo}\`\n\`${user_warns.nick}\`\n( <@${id_alvo}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "mode.logger.entrada_original")}**`,
                value: `<t:${parseInt(member_guild.joinedTimestamp / 1000)}:F> )`,
                inline: true
            },
            {
                name: `${client.emoji(47)} **${client.tls.phrase(guild, "mode.warn.advertencias_em_registro")}**`,
                value: `\`${user_warns.total} / ${guild.warn.cases}\``,
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(guild, "mode.warn.aplicador_punicao")}**`,
                value: `${client.emoji("icon_id")} \`${id_executor}\`\n\`${interaction.user.username}\`\n( <@${id_executor}> )`,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **${client.tls.phrase(guild, "mode.warn.penalidade_server")}**`,
                value: penalidades_server,
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **Tempos**`,
                value: `${client.defaultEmoji("time")} **Mute:** \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.timeout]}`)}\`\n:wastebasket: **Cronometrado:** \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.reset]}`)}\``,
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({
            text: "⠀",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    client.notify(guild.warn.channel, { content: "@here", embeds: [embed_guild] })

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