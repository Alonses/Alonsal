const { EmbedBuilder } = require('discord.js')

module.exports = async (client, message) => {

    // Verificando se o autor da mensagem editada é o bot
    if (message[0].partial) return
    if (message[0].author.bot) return

    // Mensagem com o mesmo conteúdo (links de gifs e imagens)
    if (message[0].content === message[1].content) return

    let guild = await client.getGuild(message[0].guildId)

    // Verificando se a guild habilitou o logger
    if (!client.decider(guild.conf?.logger, 0)) return

    let texto = `:pencil: | Uma [mensagem](${message[0].url}) foi atualizada por <@${message[0].author.id}>\n\n**Mensagem antiga:** \`\`\`${formata_text(message[0].content)}\`\`\`\n**Mensagem atualizada:** \`\`\`${formata_text(message[1].content)}\`\`\``
    let autor = message[0].author.id
    let local = message[0].channelId

    const embed = new EmbedBuilder()
        .setTitle("> Mensagem Atualizada")
        .setColor(0xffffff)
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
        .setFooter({ text: message[0].author.username })
        .setTimestamp()

    if (message[1].content.includes("https")) {
        const link_img = `https${message[1].content.split("https")[1].split(" ")[0]}`
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