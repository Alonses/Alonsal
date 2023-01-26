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

    console.log(err)

    if (process.env.error_channel)
        await client.discord.channels.cache.get(process.env.error_channel).send({ embeds: [embed_error] })

    const caso = "epic_embed"
    require('../automaticos/relatorio.js')({ client, caso })
}