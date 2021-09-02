module.exports = {
    name: "baidu",
    description: "Louvado seja!",
    aliases: [ "du" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args){

        const permissions = message.channel.permissionsFor(message.client.user);
        const { diversao } = require("../../arquivos/idiomas/pt-br.json");

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
        
        const { MessageAttachment } = require('discord.js');
        
        console.log(diversao[0]["baidu"]);

        const baidu = new MessageAttachment('arquivos/img/baidu.png');
        message.lineReply(diversao[0]["baidu"], baidu);
    }
};