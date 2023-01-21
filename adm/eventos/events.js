const { EmbedBuilder } = require('discord.js')

module.exports = async function ({ client }) {

    client.discord.on("guildCreate", guild => {
        let caso = 'New'
        require('./servers.js')({ client, caso, guild })
    })

    client.discord.on("guildDelete", guild => {
        let caso = 'Left'
        require('./servers.js')({ client, caso, guild })
    })

    client.discord.on("rateLimit", limit => {
        const embed = new EmbedBuilder()
            .setTitle("> RateLimit :name_badge:")
            .setColor(0xff0000)
            .setDescription(`Command: \`${ult_comando}\`\nTimeout: \`${limit.timeout}\`\nLimit: \`${limit.limit}\`\nMethod: \`${limit.method}\`\n\nPath: \`${limit.path}\`\nRoute: \`${limit.route}\``)

        client.discord.channels.cache.get('862015290433994752').send({ embeds: [embed] })
    })
}