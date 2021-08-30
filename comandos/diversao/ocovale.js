module.exports = {
    name: "ocovale",
    description: "ocovale!",
    aliases: [ "covale" ],
    cooldown: 30,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const permissions = message.channel.permissionsFor(message.client.user);

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
        
        const Discord = require('discord.js');

        const ocovale = new Discord.MessageAttachment("arquivos/videos/ocovale.mp4");
        message.channel.send("A vida com Ocovale é mais deliciosa!", ocovale);
    }
}