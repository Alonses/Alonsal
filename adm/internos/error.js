const { EmbedBuilder } = require('discord.js')

module.exports = async function({client, err}) {

    let local_erro = err.stack.split("\n")[1].trim()

    const embed_error = new EmbedBuilder({
        title: "> CeiraException",
        description: `\`\`\`🛑 ${err.name} - ${err.message}\n📑 Local: ${local_erro}\`\`\``,
        color: 0xED4245
    })

    console.log(err)
    
    await client.channels.cache.get('862015290433994752').send({ embeds: [embed_error] })
}