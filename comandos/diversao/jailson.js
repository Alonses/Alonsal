module.exports = {
    name: "jailson",
    description: "Jailson",
    aliases: [ "ja", "urso", "oco" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        const { gifs } = require("../../arquivos/json/gifs/jailson.json");

        let num = Math.round((gifs.length - 1) * Math.random());
    
        message.channel.send(gifs[num]);

        const permissions = message.channel.permissionsFor(message.client.user);
        
        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
    }
};