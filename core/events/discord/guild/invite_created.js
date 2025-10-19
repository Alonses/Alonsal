const { AuditLogEvent, PermissionsBitField } = require('discord.js')

module.exports = async ({ client, invite }) => {

    const guild = await client.getGuild(invite.guild.id)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.invite_created || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    if (!await client.execute("permissions", { interaction: invite, id_user: client.id(), permissions: PermissionsBitField.Flags.ViewAuditLog })) {

        guild.logger.invite_created = false
        guild.save()

        return client.execute("notify", {
            id_canal: guild.logger.channel,
            conteudo: { content: client.tls.phrase(guild, "mode.logger.permissao", 7) }
        })
    }

    // Coletando dados sobre o evento
    const fetchedLogs = await invite.guild.fetchAuditLogs({
        type: AuditLogEvent.InviteCreate,
        limit: 1
    })

    const registroAudita = fetchedLogs.entries.first()
    if (!registroAudita?.executor) return // Sem executor

    const embed = client.create_embed({
        title: { tls: "mode.logger.convite_criado_titulo" },
        color: "turquesa",
        description: { tls: "mode.logger.convite_criado", emoji: 43 },
        fields: [
            {
                name: client.execute("user_title", { user: registroAudita.executor, scope: guild, tls: "mode.logger.autor" }),
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            },
            {
                name: `${client.emoji(44)} **${client.tls.phrase(guild, "menu.botoes.convite")}: ${invite.code}**`,
                value: `${registroAudita.target.maxUses > 0 ? `\n${client.emoji(8)} **${client.tls.phrase(guild, "mode.logger.limite_usos", null, registroAudita.target.maxUses)}**\n` : ""}${client.emoji(31)} **${client.tls.phrase(guild, "menu.botoes.destino")}:**\n:placard: \`${registroAudita.target.channel.name}\`\n( <#${registroAudita.target.channel.id}> )`,
                inline: true
            }
        ],
        timestamp: true
    }, guild)

    if (invite._expiresTimestamp)
        embed.addFields(
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(guild, "menu.botoes.expiracao")}**`,
                value: `${client.tls.phrase(guild, "menu.botoes.expirando")} <t:${parseInt(invite._expiresTimestamp / 1000)}:R>\n( <t:${parseInt(invite._expiresTimestamp / 1000)}:f> )`,
                inline: true
            }
        )

    client.execute("notify", {
        id_canal: guild.logger.channel,
        conteudo: { embeds: [embed] }
    })
}