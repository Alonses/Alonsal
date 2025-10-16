const { listAllRankedGuilds } = require("../database/schemas/Guild")

module.exports = async ({ client }) => {

    client.cached.ranked_guilds.clear()

    // Salva em cache todos os servidores que possuem rankeamento ativo
    const guilds = await listAllRankedGuilds()

    guilds.forEach(guild => {
        client.cached.ranked_guilds.set(client.encrypt(guild.sid), true)
    })
}