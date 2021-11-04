const { gifs } = require("../../arquivos/json/gifs/jailson.json");

module.exports = {
    name: "jailson",
    description: "Jailson",
    aliases: [ "ja", "urso", "oco" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        const { diversao } = require('../../arquivos/idiomas/'+ client.idioma.getLang(message.guild.id) +'.json');

        if(!message.channel.nsfw) return message.reply(":tropical_drink: | "+ diversao[6]["nsfw_jaja"]);

        message.channel.send(gifs[Math.round((gifs.length - 1) * Math.random())]).then(() => {
            const permissions = message.channel.permissionsFor(message.client.user);

            if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
                message.delete();
        });
    }
};