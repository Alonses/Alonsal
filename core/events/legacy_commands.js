const { PermissionsBitField } = require('discord.js')

module.exports = async function ({ client, message }) {

    // Permissão para enviar mensagens no canal
    if (message.channel.type === "GUILD_TEXT")
        if (!message.channel.permissionsFor(client.id()).has([PermissionsBitField.Flags.SendMessages])) return

    if (message.content.includes(client.id()) || message.content.startsWith(".a")) {
        const { data } = require(`../../files/languages/${client.idioma.getLang(message.author.id)}.json`)
        const inicio = data.inic

        const row = client.create_buttons([
            { name: inicio["inicio"]["convidar"], value: `https://discord.com/oauth2/authorize?client_id=${client.id()}&scope=bot&permissions=1614150720`, type: 4, emoji: client.emoji("icon_integration") },
            { name: inicio["inicio"]["suporte"], value: process.env.url_support, type: 4, emoji: client.emoji("icon_rules_channel") }
        ])

        message.reply({
            content: inicio["inicio"]["slash_commands"],
            components: [row]
        })
    }
}