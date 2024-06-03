const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

module.exports = async ({ client, ban }) => {

    const guild = await client.getGuild(ban.guild.id)

    if (guild.network.member_ban_add && guild.conf.network) // Network de servidores
        client.network(guild, "ban_add", ban.user.id)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.member_ban_add || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    if (!await client.permissions(ban, client.id(), PermissionsBitField.Flags.ViewAuditLog)) {

        guild.logger.member_ban_add = false
        guild.save()

        return client.notify(guild.logger.channel, { content: client.tls.phrase(guild, "mode.logger.permissao", 7) })
    }

    // Coletando dados sobre o evento
    const fetchedLogs = await ban.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanAdd,
        limit: 1
    })

    const registroAudita = fetchedLogs.entries.first()
    let razao = `\n💂‍♂️ ${client.tls.phrase(guild, "mode.logger.sem_motivo")}`, network_descricao = "", canal_aviso = guild.logger.channel

    // Alterando o canal alvo conforme o filtro de eventos do death note
    if (guild.death_note.note && guild.death_note.member_ban_add && guild.death_note.channel)
        canal_aviso = guild.death_note.channel

    if (registroAudita.reason) { // Banimento com motivo explicado
        razao = `\n💂‍♂️ ${client.tls.phrase(guild, "mode.logger.motivo_ban")}: ${registroAudita.reason}`

        // Ação realizada através do network
        if (registroAudita.reason.includes("Network | ") && registroAudita.executorId === client.id()) {
            network_descricao = `📡 ${registroAudita.reason.split(" | ")[1]}`
            razao = ""

            if (guild.network.channel) // Ação realizada pelo network
                canal_aviso = guild.network.channel
        }
    }

    if (network_descricao.length > 1 || razao.length > 1)
        razao = `\n\`\`\`fix\n${network_descricao}${razao}\`\`\``

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.membro_banido"))
        .setColor(0xED4245)
        .setDescription(`${client.tls.phrase(guild, "mode.logger.membro_banido_desc", client.emoji("banidos"))}${razao}`)
        .setFields(
            {
                name: client.user_title(registroAudita.executor, guild, "mode.logger.autor", client.defaultEmoji("guard")),
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

    const obj = {
        embeds: [embed]
    }

    // Notificações do Death note
    if (guild.death_note.channel === canal_aviso && guild.death_note.notify)
        obj.content = "@here"

    client.notify(canal_aviso, obj)
}