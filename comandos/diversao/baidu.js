module.exports = {
    name: "baidu",
    description: "Louvado seja!",
    aliases: [ "du" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args){

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { diversao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
            
        const { MessageAttachment } = require('discord.js');
        
        const baidu = new MessageAttachment('arquivos/img/baidu.png');
        message.lineReply(diversao[0]["baidu"], baidu);

        const permissions = message.channel.permissionsFor(message.client.user);
        
        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
    }
};