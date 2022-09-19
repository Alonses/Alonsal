const create_buttons = require('../discord/create_buttons.js')
const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = async function ({ client, message }) {

    if (message.channel.type === "GUILD_TEXT") {
        const permissions = message.channel.permissionsFor(message.client.user)

        if (!permissions.has("SEND_MESSAGES")) return // Permissão para enviar mensagens no canal
    }

    if (message.content.includes(client.user.id) || message.content.startsWith(".a")) {
        const { updates } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.author.id)}.json`)

        const row = create_buttons([{ name: updates[0]["convidar"], value: `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1614150720`, type: 4, emoji: emojis.icon_integration }, { name: updates[0]["suporte"], value: `https://discord.gg/ZxHnxQDNwn`, type: 4, emoji: emojis.icon_rules_channel }])

        message.reply({ content: updates[0]["slash_commands"], components: [row] })
    }
}