const { EmbedBuilder } = require('discord.js')

const { disableGuildFeatures } = require('../../../database/schemas/Guild')
const { verifyDynamicBadge } = require('../../../database/schemas/User_badges')
const { badges } = require('../../../formatters/patterns/user')


module.exports = async ({ client, guild }) => {

    if (client.id() !== process.env.client_1 || !process.env.channel_server) return

    // Desligando as funções do servidor
    await disableGuildFeatures(client, guild.id)

    const embed = new EmbedBuilder()
        .setTitle("> 🔴 Server update")
        .setColor(0xd4130d)
        .setDescription(`:globe_with_meridians: ( \`${guild.id}\` | \`${guild.name}\` )`)
        .setTimestamp()

    client.notify(process.env.channel_server, { embeds: [embed] })

    verifyDynamicBadge(client, "hoster", badges.HOSTER) // Verificando qual usuário mais convidou o bot
}