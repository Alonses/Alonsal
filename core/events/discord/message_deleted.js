const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

module.exports = async ({ client, message }) => {

    // Verificando se o autor da mensagem excluída é o bot
    if (message.partial || !client.x.logger) return
    if (message.author.bot) return

    let guild = await client.getGuild(message.guildId), attachments = []

    // Verificando se a guild habilitou o logger
    if (!client.decider(guild.conf?.logger, 0)) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    const bot = await client.getMemberGuild(message, client.id())
    if (!bot.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {

        guild.conf.logger = 0
        await guild.save()

        return client.notify(guild.logger.channel, `@here ${client.tls.phrase(guild, "mode.logger.permissao", 7)}`)
    }

    // Coletando dados sobre o evento
    const fetchedLogs = await message.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
        limit: 1,
    })

    const registroAudita = fetchedLogs.entries.first()

    if (message.attachments) {
        message.attachments.forEach(attach => {
            attachments.push(attach.attachment)
        })
    }

    let texto_mensagem = message.content

    // Mensagem sem texto enviado
    if (!message.content)
        texto_mensagem = client.tls.phrase(guild, "mode.logger.sem_texto")

    // Apenas arquivos enviados
    if (attachments.length > 0 && !message.content)
        texto_mensagem = attachments.join("\n\n")

    let texto = client.replace(client.tls.phrase(guild, "mode.logger.auto_exclusao", 13), [message.author.id, message.url])
    let autor = message.author.id, local = message.channelId, row

    // Mensagem excluída por um moderador
    if (message.author.id !== registroAudita.executor.id && message.id === registroAudita.targetId)
        texto = client.replace(client.tls.phrase(guild, "mode.logger.auto_exclusao", 13), [message.url, message.author.id])

    texto += `\n\n**${client.tls.phrase(guild, "mode.logger.conteudo_excluido")}:** \`\`\`${formata_text(texto_mensagem)}\`\`\``

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.mensagem_excluida"))
        .setColor(0xED4245)
        .setDescription(texto.slice(0, 4095))
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "mode.logger.autor")}**`,
                value: `${client.emoji("icon_id")} \`${autor}\`\n( <@${autor}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("paper")} **${client.tls.phrase(guild, "util.rastreio.local")}**`,
                value: `${client.emoji("icon_id")} \`${local}\`\n( <#${local}> )`,
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({
            text: message.author.username
        })

    // Mensagem excluída por um moderador
    if (message.author.id !== registroAudita.executor.id && message.id === registroAudita.targetId)
        embed.addFields(
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(guild, "mode.logger.excluido")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.executor.id}\`\n( <@${registroAudita.executor.id}> )`,
                inline: false
            }
        )

    if (texto_mensagem.includes("https")) {
        const link_img = `https${texto_mensagem.split("https")[1].split(" ")[0]}`

        row = client.create_buttons([
            { name: client.tls.phrase(guild, "menu.botoes.navegador"), type: 4, emoji: "🌐", value: link_img }
        ])
    }

    if (row)
        client.notify(guild.logger.channel, { embed: embed, components: row })
    else
        client.notify(guild.logger.channel, embed)
}

function formata_text(texto) {
    return texto.replaceAll("`", "'")
}