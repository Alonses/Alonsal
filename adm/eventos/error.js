const { EmbedBuilder } = require('discord.js')

module.exports = async function ({ client, err, local }) {

    let local_erro = err.stack.split("\n")[1].trim()
    let titulo = "> CeiraException"

    if (local === "games")
        titulo = "> Epic Embed Fail"

    const embed_error = new EmbedBuilder({
        title: titulo,
        description: `\`\`\`🛑 ${err.name} - ${err.message}\n📑 Local: ${local_erro}\`\`\``,
        color: 0xED4245
    })

    if (process.env.channel_error)
        client.notify(process.env.channel_error, embed_error)

    console.log(err)

    const caso = "epic_embed"
    require('../automaticos/relatorio')({ client, caso })
}