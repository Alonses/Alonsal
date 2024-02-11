const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

module.exports = async ({ client, invite }) => {

    const guild = await client.getGuild(invite.guild.id)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.invite_deleted || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    if (!await client.permissions(invite, client.id(), PermissionsBitField.Flags.ViewAuditLog)) {

        guild.logger.invite_deleted = false
        await guild.save()

        return client.notify(guild.logger.channel, { content: `@here\n${client.tls.phrase(guild, "mode.logger.permissao", 7)}` })
    }

    // Coletando dados sobre o evento
    const fetchedLogs = await invite.guild.fetchAuditLogs({
        type: AuditLogEvent.InviteDelete,
        limit: 1
    })

    const registroAudita = fetchedLogs.entries.first()

    const embed = new EmbedBuilder()
        .setTitle("> Convite excluído 🔗")
        .setColor(0xED4245)
        .setDescription("**Um convite foi excluído!**")
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "mode.logger.autor")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            },
            {
                name: `${client.emoji(44)} **Convite: ${invite.code}**`,
                value: `${registroAudita.target.maxUses > 0 ? `\n${client.emoji(8)} **Limite de ${registroAudita.target.maxUses} usos**\n` : ""}${client.emoji(31)} **Destino:** <#${registroAudita.target.channelId}>`,
                inline: true
            }
        )
        .setTimestamp()

    client.notify(guild.logger.channel, { embeds: [embed] })
}