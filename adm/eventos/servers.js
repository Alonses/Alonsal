const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, caso, guild }) => {

    if (client.id() !== process.env.client_1) return

    let ocasiao = "> 🟢 Server update", cor = 0x29BB8E
    let canais = guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size

    let server_info = `\n\n:busts_in_silhouette: Members ( \`${guild.memberCount - 1}\` )\n:placard: Channels ( \`${canais}\` )`

    if (caso === "Left")
        ocasiao = "> 🔴 Server update", cor = 0xd4130d, server_info = ""

    const embed_sv = new EmbedBuilder()
        .setTitle(ocasiao)
        .setColor(cor)
        .setDescription(`:globe_with_meridians: ( \`${guild.id}\` | \`${guild.name}\` )${server_info}`)
        .setTimestamp()

    client.discord.channels.cache.get('846853254192693269').send({ embeds: [embed_sv] })
}