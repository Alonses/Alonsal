const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

module.exports = async ({ client, message }) => {

    // Verificando se o autor da mensagem excluída é o bot
    if (message.partial || message.author.bot) return

    const guild = await client.getGuild(message.guildId)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.message_delete || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    if (!await client.permissions(message, client.id(), PermissionsBitField.Flags.ViewAuditLog)) {

        guild.logger.message_delete = false
        guild.save()

        return client.notify(guild.logger.channel, { content: client.tls.phrase(guild, "mode.logger.permissao", 7) })
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

    let texto_mensagem = message.content

    let texto = `${client.tls.phrase(guild, "mode.logger.auto_exclusao", 13, [message.author.id, message.url])}\n`
    let autor = message.author.id, local = message.channelId, row

    if (registroAudita) // Verificando se foi excluída por outro usuário
        if (message.author.id !== registroAudita.executorId && message.id === registroAudita.targetId)
            texto = client.tls.phrase(guild, "mode.logger.mode_exclusao", 13, [message.url, message.author.id])

    if (message.content) // Mensagem com texto escrito
        texto += `\n**${client.tls.phrase(guild, "mode.logger.conteudo_excluido")}:** \`\`\`${client.replace(texto_mensagem, null, ["`", "'"])}\`\`\``

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.mensagem_excluida"))
        .setColor(0xED4245)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "mode.logger.autor")}**`,
                value: `${client.emoji("icon_id")} \`${autor}\`\n${client.emoji("mc_name_tag")} \`${message.author.username}\`\n( <@${autor}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("paper")} **${client.tls.phrase(guild, "util.rastreio.local")}**`,
                value: `${client.emoji("icon_id")} \`${local}\`\n( <#${local}> )`,
                inline: true
            }
        )
        .setTimestamp()

    if (registroAudita) // Verificando se foi excluída por outro usuário
        if (message.author.id !== registroAudita.executorId && message.id === registroAudita.targetId)
            embed.addFields(
                {
                    name: `${client.defaultEmoji("guard")} **${client.tls.phrase(guild, "mode.logger.excluido")}**`,
                    value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                    inline: false
                }
            )

    if (attachments.length > 0) // Arquivos anexados
        texto = `${texto}\n**Anexos:**\n${attachments.join("\n\n")}`

    embed.setDescription(texto)

    if (row) client.notify(guild.logger.channel, { embeds: [embed], components: [row] })
    else client.notify(guild.logger.channel, { embeds: [embed] })
}