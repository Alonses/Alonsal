const { EmbedBuilder } = require('discord.js')

module.exports = async function ({ client }) {

    if (client.x.force_update) return

    console.log("🟠 | Ligando eventos")

    client.discord.on("guildCreate", guild => {
        let caso = "new"
        require('./discord/guild.js')({ client, caso, guild })
    })

    client.discord.on("guildDelete", guild => {
        let caso = "left"
        require('./discord/guild.js')({ client, caso, guild })
    })

    client.discord.on("messageDelete", message => {
        let caso = "delete"
        require('./discord/message.js')(client, caso, message)
    })

    client.discord.on("messageUpdate", (old_message, new_message) => {
        let caso = "update"
        require('./discord/message.js')(client, caso, [old_message, new_message])
    })

    client.discord.on("rateLimit", limit => {
        if (!process.env.channel_error) return

        const embed = new EmbedBuilder()
            .setTitle("> RateLimit :name_badge:")
            .setColor(0xff0000)
            .setDescription(`Command: \`${ult_comando}\`\nTimeout: \`${limit.timeout}\`\nLimit: \`${limit.limit}\`\nMethod: \`${limit.method}\`\n\nPath: \`${limit.path}\`\nRoute: \`${limit.route}\``)

        client.notify(process.env.channel_error, embed)
    })

    console.log("🟢 | Eventos acionados com sucesso")
}