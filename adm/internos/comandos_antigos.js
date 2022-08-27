const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

module.exports = async function({client, message}){

    if (message.channel.type === "GUILD_TEXT") {
        const permissions = message.channel.permissionsFor(message.client.user)

        if (!permissions.has("SEND_MESSAGES")) return // Permissão para enviar mensagens no canal
    }

    const { updates } = require(`../../arquivos/idiomas/${client.idioma.getLang(message)}.json`)

    if (message.content.includes(client.user.id) || message.content.startsWith(".a")){
    
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel(updates[0]["convidar"])
                .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1614150720`)
                .setStyle(ButtonStyle.Link),
            )
            
        message.reply({ content: updates[0]["slash_commands"], components: [row]})
    }
}