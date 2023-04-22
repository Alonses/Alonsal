const { EmbedBuilder } = require('discord.js')

const { disableGameChannel, disableReportChannel } = require('../../adm/database/schemas/Guild')

module.exports = async ({ client, caso, guild }) => {

    // Previne que o bot responda a interações enquanto estiver atualizando comandos
    if (client.x.force_update) return

    if (client.id() !== process.env.client_1 || !process.env.channel_server) return

    let ocasiao = "> 🟢 Server update", cor = 0x29BB8E
    let canais = guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size

    let server_info = `\n\n:busts_in_silhouette: Members ( \`${guild.memberCount - 1}\` )\n:placard: Channels ( \`${canais}\` )`

    if (caso === "Left") {
        ocasiao = "> 🔴 Server update", cor = 0xd4130d, server_info = ""

        // Desligando o anúncio de games gratuitos e reports de usuários para o servidor
        await disableGameChannel(guild.id)
        await disableReportChannel(guild.id)
    }

    const embed_sv = new EmbedBuilder()
        .setTitle(ocasiao)
        .setColor(cor)
        .setDescription(`:globe_with_meridians: ( \`${guild.id}\` | \`${guild.name}\` )${server_info}`)
        .setTimestamp()

    client.notify(process.env.channel_server, embed_sv)
}