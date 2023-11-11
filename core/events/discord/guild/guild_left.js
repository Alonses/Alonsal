const { EmbedBuilder } = require('discord.js')

const { disableGameChannel, disableReportChannel } = require('../../../database/schemas/Guild')
const { verifyDynamicBadge } = require('../../../database/schemas/Badge')
const { badges } = require('../../../data/badges')

module.exports = async ({ client, guild }) => {

    if (client.id() !== process.env.client_1 || !process.env.channel_server) return

    // Desligando o anúncio de games gratuitos e reports de usuários para o servidor
    await disableGameChannel(guild.id)
    await disableReportChannel(guild.id)

    // Removendo o usuário que adicionou o bot ao servidor
    const internal_guild = await client.getGuild(guild.id)
    internal_guild.inviter = null

    await internal_guild.save()

    const embed = new EmbedBuilder()
        .setTitle("> 🔴 Server update")
        .setColor(0xd4130d)
        .setDescription(`:globe_with_meridians: ( \`${guild.id}\` | \`${guild.name}\` )`)
        .setTimestamp()

    client.notify(process.env.channel_server, { embeds: [embed] })

    verifyDynamicBadge(client, "hoster", badges.HOSTER) // Verificando qual usuário possui mais bufunfas
}