const { EmbedBuilder } = require('discord.js')

module.exports = async (client, err, local) => {

    let local_erro = err.stack.split("\n")[1].trim()
    let titulo = `> CeiraException | ${local}`

    const embed = new EmbedBuilder({
        title: titulo,
        description: `\`\`\`🛑 ${err.name} - ${err.message}\n📑 Local: ${local_erro}\`\`\``,
        color: 0xED4245
    })

    console.log(err)
    client.notify(process.env.channel_error, { embeds: [embed] })

    client.journal("epic_embed")
}