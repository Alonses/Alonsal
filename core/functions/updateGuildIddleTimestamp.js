const { defaultUserEraser } = require("../formatters/patterns/timeout")

module.exports = async ({ client, data }) => {

    const id_guild = data.sid

    if (!client.cached.iddleGuilds.has(id_guild)) {

        const guild = await client.getGuild(id_guild)

        // Atualizando o tempo de inatividade do servidor
        guild.iddle.timestamp = client.execute("timestamp") + defaultUserEraser[guild.iddle.timeout]
        guild.save()

        client.cached.iddleGuilds.set(id_guild, true)
    }
}