const { EmbedBuilder } = require('discord.js')

module.exports = async (client, message) => {

    // Verificando se o autor da mensagem excluída é o bot
    if (message.partial) return
    if (message.author.bot) return

    let guild = await client.getGuild(message.guildId)

    // Verificando se a guild habilitou o logger
    if (!client.decider(guild.conf?.logger, 0)) return

    let texto = `:wastebasket: | Uma [mensagem](${message.url}) foi excluída por <@${message.author.id}>\n\n**Conteúdo excluído:** \`\`\`${formata_text(message.content)}\`\`\``
    let autor = message.author.id
    let local = message.channelId

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

    client.notify(guild.logger.channel, embed)
}

function formata_text(texto) {
    return texto.replaceAll("`", "'")
}