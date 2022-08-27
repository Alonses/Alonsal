module.exports = (client, id_emoji) => {

    if (typeof id_emoji == "object") // Array de emojis
        id_emoji = id_emoji[Math.round((id_emoji.length - 1) * Math.random())]
    
    return client.emojis.cache.get(id_emoji).toString()
}