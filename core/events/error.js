const { EmbedBuilder } = require('discord.js')

module.exports = async (client, err, local) => {

    let local_erro = err.stack.split("\n")[1].trim()
    let titulo = `> CeiraException | ${local}`

    const embed_error = new EmbedBuilder({
        title: titulo,
        description: `\`\`\`🛑 ${err.name} - ${err.message}\n📑 Local: ${local_erro}\`\`\``,
        color: 0xED4245
    })

    if (process.env.channel_error)
        client.notify(process.env.channel_error, embed_error)

    console.log(err)
    client.journal("epic_embed")
}