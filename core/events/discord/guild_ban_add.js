const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

module.exports = async ({ client, ban }) => {

    const guild = await client.getGuild(ban.guild.id)

    if (guild.network.member_ban_add && guild.conf.network) // Network de servidores
        client.network(guild, "ban_add", ban.user.id)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.member_ban_add || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    const permissoes = await client.permissions(ban, client.id(), PermissionsBitField.Flags.ViewAuditLog)
    if (!permissoes) {

        guild.logger.member_ban_add = false
        await guild.save()

        return client.notify(guild.logger.channel, { content: `@here\n${client.tls.phrase(guild, "mode.logger.permissao", 7)}` })
    }

    // Coletando dados sobre o evento
    const fetchedLogs = await ban.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanAdd,
        limit: 1,
    })

    const registroAudita = fetchedLogs.entries.first()
    let razao = `\n\`\`\`fix\n💂‍♂️ ${client.tls.phrase(guild, "mode.logger.sem_motivo")}\`\`\``

    if (registroAudita.reason) // Banimento com motivo explicado
        razao = `\n\`\`\`fix\n💂‍♂️ ${client.tls.phrase(guild, "mode.logger.motivo_ban")}: ${registroAudita.reason}\`\`\``

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.membro_banido"))
        .setColor(0xED4245)
        .setDescription(`${client.tls.phrase(guild, "mode.logger.membro_banido_desc", client.emoji("banidos"))}${razao}`)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "mode.logger.autor")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.targetId}\`\n( <@${registroAudita.targetId}> )`,
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({
            text: registroAudita.executor.username
        })

    client.notify(guild.logger.channel, { embeds: [embed] })
}