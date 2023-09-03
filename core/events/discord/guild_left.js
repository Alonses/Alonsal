const { EmbedBuilder } = require('discord.js')

const { disableGameChannel, disableReportChannel } = require('../../database/schemas/Guild')

module.exports = async ({ client, guild }) => {

    if (client.id() !== process.env.client_1 || !process.env.channel_server || !client.x.logger) return

    // Desligando o anúncio de games gratuitos e reports de usuários para o servidor
    await disableGameChannel(guild.id)
    await disableReportChannel(guild.id)

    const embed_sv = new EmbedBuilder()
        .setTitle("> 🔴 Server update")
        .setColor(0xd4130d)
        .setDescription(`:globe_with_meridians: ( \`${guild.id}\` | \`${guild.name}\` )`)
        .setTimestamp()

    client.notify(process.env.channel_server, embed_sv)
}