const { EmbedBuilder } = require('discord.js')

module.exports = (client, err, local) => {

    const embed = new EmbedBuilder({
        title: `> CeiraException | ${local}`,
        description: `\`\`\`🛑 ${err.name} - ${err.message}\n\n📑 Local: ${err.stack}\`\`\``,
        color: 0xED4245
    })

    console.log(err)

    client.notify(process.env.channel_error, { embeds: [embed] })
    client.journal("epic_embed")
}