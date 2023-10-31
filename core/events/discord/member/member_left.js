const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

module.exports = async (client, dados) => {

    const guild = await client.getGuild(dados.guild.id)
    const user_alvo = dados.user

    // Verificando se a guild habilitou o logger
    if (!guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    const permissoes = await client.permissions(dados, client.id(), PermissionsBitField.Flags.ViewAuditLog)
    if (!permissoes) {

        guild.logger.member_left = false
        guild.logger.member_kick = false
        guild.logger.member_ban_add = false
        await guild.save()

        return client.notify(guild.logger.channel, { content: `@here\n${client.tls.phrase(guild, "mode.logger.permissao", 7)}` })
    }

    // Verificando se o usuário foi expulso do servidor
    const fetchedLogs2 = await dados.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberKick,
        limit: 1,
    })

    const registroAudita2 = fetchedLogs2.entries.first()

    if (registroAudita2)
        if (registroAudita2.targetId === user_alvo.id) // Membro foi expulso do servidor
            return require('./member_kick.js')({ client, guild, user_alvo, registroAudita2 })

    // Verificando se o usuário foi banido
    const fetchedLogs = await dados.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanAdd,
        limit: 1,
    })

    const registroAudita = fetchedLogs.entries.first()

    if (registroAudita)
        if (registroAudita.targetId === user_alvo.id || !guild.logger.member_left)
            return // Usuário foi banido ou recurso desativado

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.membro_saiu"))
        .setColor(0xED4245)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n( <@${user_alvo.id}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "mode.logger.entrada_original")}**`,
                value: `<t:${parseInt(dados.joinedTimestamp / 1000)}:F> )`,
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({
            text: user_alvo.username
        })

    // Usuário é um BOT
    if (user_alvo.bot)
        embed.addFields(
            {
                name: `${client.emoji("icon_integration")} **${client.tls.phrase(guild, "util.user.bot")}**`,
                value: "⠀",
                inline: true
            }
        )

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })

    if (url_avatar)
        embed.setThumbnail(url_avatar)

    client.notify(guild.logger.channel, { embeds: [embed] })
}