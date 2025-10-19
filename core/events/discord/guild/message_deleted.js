const { AuditLogEvent, PermissionsBitField } = require('discord.js')

module.exports = async ({ client, message }) => {

    // Verificando se o autor da mensagem excluída é o bot
    if (message.partial || message.author.bot) return

    const guild = await client.getGuild(message.guildId)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.message_delete || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    if (!await client.execute("permissions", { message, id_user: client.id(), permissions: PermissionsBitField.Flags.ViewAuditLog })) {

        guild.logger.message_delete = false
        guild.save()

        return client.execute("notify", {
            id_canal: guild.logger.channel,
            conteudo: { content: client.tls.phrase(guild, "mode.logger.permissao", 7) }
        })
    }

    // Coletando dados sobre o evento
    const fetchedLogs = await message.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
        limit: 1
    })

    const registroAudita = fetchedLogs.entries.first(), attachments = []

    if (message.attachments)
        message.attachments.forEach(attach => {
            attachments.push(attach.attachment)
        })

    let texto = `${client.tls.phrase(guild, "mode.logger.auto_exclusao", 13, [message.author.id, message.url])}\n`

    if (registroAudita) // Verificando se foi excluída por outro usuário
        if (message.author.id !== registroAudita.executorId && message.id === registroAudita.targetId)
            texto = client.tls.phrase(guild, "mode.logger.mode_exclusao", 13, [message.url, message.author.id])

    if (message.content) // Mensagem com texto escrito
        texto += `\n**${client.tls.phrase(guild, "mode.logger.conteudo_excluido")}:** \`\`\`${client.execute("replace", { string: message.content, especifico: ["`", "'"] })}\`\`\``

    const embed = client.create_embed({
        title: { tls: "mode.logger.mensagem_excluida" },
        color: "salmao",
        fields: [
            {
                name: client.execute("user_title", { user: message.author, scope: guild, tls: "mode.logger.autor" }),
                value: `${client.emoji("icon_id")} \`${message.author.id}\`\n${client.emoji("mc_name_tag")} \`${message.author.username}\`\n( <@${message.author.id}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("paper")} **${client.tls.phrase(guild, "util.rastreio.local")}**`,
                value: `${client.emoji("icon_id")} \`${message.channelId}\`\n:placard: \`${message.channel.name}\`\n( <#${message.channelId}> )`,
                inline: true
            }
        ],
        timestamp: true
    }, guild)

    if (registroAudita) // Verificando se foi excluída por outro usuário
        if (message.author.id !== registroAudita.executorId && message.id === registroAudita.targetId)
            embed.addFields(
                {
                    name: client.execute("user_title", { user: registroAudita.executor, scope: guild, tls: "mode.logger.excluido", emoji: client.defaultEmoji("guard") }),
                    value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                    inline: false
                }
            )

    if (attachments.length > 0) // Arquivos anexados
        texto = `${texto}\n**${client.tls.phrase(guild, "mode.logger.anexos")}:**\n${attachments.join("\n\n")}`

    embed.setDescription(texto)

    client.execute("notify", {
        id_canal: guild.logger.channel,
        conteudo: { embeds: [embed] }
    })
}