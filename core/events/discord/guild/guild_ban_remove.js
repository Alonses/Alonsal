const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

module.exports = async ({ client, ban }) => {

    const guild = await client.getGuild(ban.guild.id)

    if (guild.network.member_ban_add && guild.conf.network) // Network de servidores
        client.network(guild, "ban_del", ban.user.id)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.member_ban_remove || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    if (!await client.permissions(ban, client.id(), PermissionsBitField.Flags.ViewAuditLog)) {

        guild.logger.member_ban_remove = false
        await guild.save()

        return client.notify(guild.logger.channel, { content: client.tls.phrase(guild, "mode.logger.permissao", 7) })
    }

    // Coletando dados sobre o evento
    const fetchedLogs = await ban.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanRemove,
        limit: 1
    })

    const registroAudita = fetchedLogs.entries.first()

    let razao = "", network_descricao = "", canal_aviso = guild.logger.channel
    if (registroAudita.reason) { // Desbanimento com motivo explicado
        razao = `\n💂‍♂️ ${client.tls.phrase(guild, "mode.logger.motivo_ban")}: ${registroAudita.reason.split("Network | ")[1]}`

        // Ação realizada através do network
        if (registroAudita.reason.includes("Network") && registroAudita.executorId === client.id()) {
            network_descricao = `📡 ${registroAudita.reason.split(" | ")[1]}`
            razao = ""

            if (guild.network.channel) // Ação realizada pelo network
                canal_aviso = guild.network.channel
        }
    }

    if (network_descricao.length > 1 || razao.length > 1)
        razao = `\n\`\`\`fix\n${network_descricao}${razao}\`\`\``

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.membro_desbanido"))
        .setColor(0xED4245)
        .setDescription(`${client.tls.phrase(guild, "mode.logger.membro_desbanido_desc", client.emoji("emojis_dancantes"))}${razao}`)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "mode.logger.autor")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.targetId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.target.username}\`\n( <@${registroAudita.targetId}> )`,
                inline: true
            }
        )
        .setTimestamp()

    client.notify(canal_aviso, { embeds: [embed] })
}