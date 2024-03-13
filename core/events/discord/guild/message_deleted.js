const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

const { verifySuspiciousLink } = require('../../../database/schemas/Spam_link')

module.exports = async ({ client, message }) => {

    // Verificando se o autor da mensagem excluída é o bot
    if (message.partial || message.author.bot) return

    const guild = await client.getGuild(message.guildId), attachments = []

    // Verificando se a guild habilitou o logger
    if (!guild.logger.message_delete || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    if (!await client.permissions(message, client.id(), PermissionsBitField.Flags.ViewAuditLog)) {

        guild.logger.message_delete = false
        await guild.save()

        return client.notify(guild.logger.channel, { content: client.tls.phrase(guild, "mode.logger.permissao", 7) })
    }

    // Coletando dados sobre o evento
    const fetchedLogs = await message.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
        limit: 1
    })

    const registroAudita = fetchedLogs.entries.first()

    if (message.attachments)
        message.attachments.forEach(attach => {
            attachments.push(attach.attachment)
        })

    let texto_mensagem = message.content

    // Mensagem sem texto enviado
    if (!message.content)
        texto_mensagem = client.tls.phrase(guild, "mode.logger.sem_texto")

    // Apenas arquivos enviados
    if (attachments.length > 0 && !message.content)
        texto_mensagem = attachments.join("\n\n")

    let texto = client.tls.phrase(guild, "mode.logger.auto_exclusao", 13, [message.author.id, message.url])
    let autor = message.author.id, local = message.channelId, row

    if (registroAudita) // Verificando se foi excluída por outro usuário
        if (message.author.id !== registroAudita.executorId && message.id === registroAudita.targetId)
            texto = client.tls.phrase(guild, "mode.logger.mode_exclusao", 13, [message.url, message.author.id])

    texto += `\n\n**${client.tls.phrase(guild, "mode.logger.conteudo_excluido")}:** \`\`\`${client.replace(texto_mensagem, null, ["`", "'"])}\`\`\``

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.mensagem_excluida"))
        .setColor(0xED4245)
        .setDescription(texto.slice(0, 4095))
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

    if (texto_mensagem.includes("https")) {
        const link_img = `https${texto_mensagem.split("https")[1].split(" ")[0]}`

        if (!await verifySuspiciousLink(link_img)) // Verificando se o link não é suspeito
            row = client.create_buttons([
                { name: client.tls.phrase(guild, "menu.botoes.navegador"), type: 4, emoji: "🌐", value: link_img }
            ])
    }

    if (row)
        client.notify(guild.logger.channel, { embeds: [embed], components: [row] })
    else
        client.notify(guild.logger.channel, { embeds: [embed] })
}