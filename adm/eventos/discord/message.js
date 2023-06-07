const { EmbedBuilder } = require('discord.js')

module.exports = async (client, caso, message) => {

    let guild, autor, local

    if (caso === "delete")
        guild = await client.getGuild(message.guildId)
    else
        guild = await client.getGuild(message[0].guildId)

    // Verificando se a guild habilitou o logger
    if (!client.decider(guild.conf?.logger, 0))
        return

    const embed = new EmbedBuilder()
        .setColor(0xffffff)

    if (caso === "update") {
        embed.setTitle("> Mensagem Atualizada :pencil:")
            .setFooter({ text: message[0].author.username })

        texto = `Mensagem antiga: \`\`\`${formata_text(message[0].content)}\`\`\`\nMensagem atualizada: \`\`\`${formata_text(message[1].content)}\`\`\``
        autor = message[0].author.id
        local = message[0].channelId
    }

    if (caso === "delete") {
        embed.setTitle("> Mensagem Excluída :wastebasket:")
            .setColor(0xED4245)
            .setFooter({ text: message.author.username })

        texto = `Conteúdo excluído: \`\`\`${formata_text(message.content)}\`\`\``
        autor = message.author.id
        local = message.channelId
    }

    embed.setDescription(texto)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **Autor**`,
                value: `**:label: ID:** \`${autor}\`\n( <@${autor}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("paper")} **Local**`,
                value: `**:label: ID:** \`${local}\`\n( <#${local}> )`,
                inline: true
            }
        )
        .setTimestamp()

    client.notify(guild.logger.channel, embed)
}

function formata_text(texto) {
    return texto.replaceAll("`", "'")
}