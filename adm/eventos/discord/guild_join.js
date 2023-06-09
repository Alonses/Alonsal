const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, guild }) => {

    if (client.id() !== process.env.client_1 || !process.env.channel_server) return

    let canais = guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size
    let server_info = `\n\n:busts_in_silhouette: **Members** ( \`${guild.memberCount - 1}\` )\n:placard: **Channels** ( \`${canais}\` )`

    const embed_sv = new EmbedBuilder()
        .setTitle("> 🟢 Server update")
        .setColor(0x29BB8E)
        .setDescription(`:globe_with_meridians: ( \`${guild.id}\` | \`${guild.name}\` )${server_info}`)
        .setTimestamp()

    client.notify(process.env.channel_server, embed_sv)
}