module.exports = async (client) => {

    const emojis = {}

    // Listando todos os emojis do cache do bot
    client.discord.emojis.cache.forEach(emoji => {
        if (process.env.guild_emojis.includes(emoji.guild.id))
            emojis[emoji.id] = { name: emoji.name, animated: emoji.animated }
    })

    // Salva os emojis no cache do bot
    client.cached.custom_emojis = emojis
}