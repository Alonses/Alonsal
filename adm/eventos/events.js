const { EmbedBuilder } = require('discord.js')

module.exports = async function ({ client }) {

    console.log("Ligando eventos")

    client.discord.on("guildCreate", guild => {
        let caso = "New"
        require('./servers.js')({ client, caso, guild })
    })

    client.discord.on("guildDelete", guild => {
        let caso = "Left"
        require('./servers.js')({ client, caso, guild })
    })

    client.discord.on("rateLimit", limit => {
        if (!process.env.channel_error) return

        const embed = new EmbedBuilder()
            .setTitle("> RateLimit :name_badge:")
            .setColor(0xff0000)
            .setDescription(`Command: \`${ult_comando}\`\nTimeout: \`${limit.timeout}\`\nLimit: \`${limit.limit}\`\nMethod: \`${limit.method}\`\n\nPath: \`${limit.path}\`\nRoute: \`${limit.route}\``)

        client.notify(process.env.channel_error, embed)
    })
}