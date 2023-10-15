const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

module.exports = async ({ client, ban }) => {

    return

    const guild = await client.getGuild(ban.guildId)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.member_ban_add || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    const bot = await client.getMemberGuild(channel, client.id())
    if (!bot.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {

        guild.logger.member_ban_add = false
        await guild.save()

        return client.notify(guild.logger.channel, { content: `@here ${client.tls.phrase(guild, "mode.logger.permissao", 7)}` })
    }

    // Coletando dados sobre o evento
    const fetchedLogs = await channel.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanAdd,
        limit: 1,
    })

    const registroAudita = fetchedLogs.entries.first()

    const embed = new EmbedBuilder()
        .setTitle("> Membro banido")
        .setColor(0xED4245)
        .setDescription(`${client.emoji("banidos")} | Um membro foi banido!`)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "mode.logger.autor")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("person")} **Membro**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.user.id}\`\n( <@${registroAudita.user.id}> )`,
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({
            text: registroAudita.executor.username
        })

    client.notify(guild.logger.channel, { embeds: [embed] })
}