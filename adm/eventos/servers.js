const { EmbedBuilder } = require('discord.js')

const { removeGameChannel } = require('../../adm/database/schemas/Guild')

module.exports = async ({ client, caso, guild }) => {

    if (client.id() !== process.env.client_1 || !process.env.server_channel) return

    let ocasiao = "> 🟢 Server update", cor = 0x29BB8E
    let canais = guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size

    let server_info = `\n\n:busts_in_silhouette: Members ( \`${guild.memberCount - 1}\` )\n:placard: Channels ( \`${canais}\` )`

    if (caso === "Left") {
        ocasiao = "> 🔴 Server update", cor = 0xd4130d, server_info = ""

        // Desligando o anúncio de games gratuitos para o servidor
        await removeGameChannel(guild.id)
    }

    const embed_sv = new EmbedBuilder()
        .setTitle(ocasiao)
        .setColor(cor)
        .setDescription(`:globe_with_meridians: ( \`${guild.id}\` | \`${guild.name}\` )${server_info}`)
        .setTimestamp()

    client.notify(process.env.server_channel, embed_sv)
}