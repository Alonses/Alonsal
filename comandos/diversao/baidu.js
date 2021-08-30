module.exports = {
    name: "baidu",
    description: "Louvado seja!",
    aliases: [ "du" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const permissions = message.channel.permissionsFor(message.client.user);

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
        
        const { MessageAttachment } = require('discord.js');
        
        const baidu = new MessageAttachment('arquivos/img/baidu.png');
        message.channel.send(`${message.author} Louvado seja!!`, baidu);
    }
};