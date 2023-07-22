const { EmbedBuilder } = require('discord.js')

module.exports = async (client, message) => {

    // Verificando se o autor da mensagem excluída é o bot
    if (message.partial || !client.x.logger) return
    if (message.author.bot) return

    let guild = await client.getGuild(message.guildId), attachments = []

    // Verificando se a guild habilitou o logger
    if (!client.decider(guild.conf?.logger, 0)) return

    if (message.attachments) {
        message.attachments.forEach(attach => {
            attachments.push(attach.attachment)
        })
    }

    let texto_mensagem = message.content

    // Mensagem sem texto enviado
    if (!message.content)
        texto_mensagem = "Sem texto incluso"

    // Apenas arquivos enviados
    if (attachments.length > 0 && !message.content)
        texto_mensagem = attachments.join("\n\n")

    let texto = `:wastebasket: | Uma [mensagem](${message.url}) de <@${message.author.id}> foi excluída\n\n**Conteúdo excluído:** \`\`\`${formata_text(texto_mensagem)}\`\`\``
    let autor = message.author.id, local = message.channelId, row = null

    const embed = new EmbedBuilder()
        .setTitle("> Mensagem Excluída")
        .setColor(0xED4245)
        .setDescription(texto)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **Autor**`,
                value: `${client.emoji("icon_id")} \`${autor}\`\n( <@${autor}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("paper")} **Local**`,
                value: `${client.emoji("icon_id")} \`${local}\`\n( <#${local}> )`,
                inline: true
            }
        )
        .setFooter({ text: message.author.username })
        .setTimestamp()

    if (texto_mensagem.includes("https")) {
        const link_img = `https${texto_mensagem.split("https")[1].split(" ")[0]}`
        row = client.create_buttons([{ name: "Abrir no navegador", type: 4, emoji: "🌐", value: link_img }])
    }

    if (row)
        client.notify(guild.logger.channel, { embed: embed, components: row })
    else
        client.notify(guild.logger.channel, embed)
}

function formata_text(texto) {
    return texto.replaceAll("`", "'")
}