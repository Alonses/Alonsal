module.exports = {
    name: "piao",
    description: "Roda o pião dona maria!",
    aliases: [ "" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { diversao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        
        const permissions = message.channel.permissionsFor(message.client.user);

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
        
        message.channel.send( diversao[5]["peao"] +"!"+` ${message.author}`);
        message.channel.send('https://tenor.com/view/pi%C3%A3o-da-casa-propria-silvio-santos-dona-maria-slondo-loop-gif-21153780');
    }
};