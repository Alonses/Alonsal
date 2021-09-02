module.exports = {
    name: "esfiha",
    description: "Esfihas do grande rogério!",
    aliases: [ "sf", "sfiha" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const permissions = message.channel.permissionsFor(message.client.user);
        const { diversao } = require("../../arquivos/idiomas/pt-br.json");

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
        
        message.channel.send( diversao[1]["asf"] +' :yum: :yum: :yum:');
        message.channel.send('https://tenor.com/view/gil-das-esfihas-galerito-esfiha-meme-brasil-gif-21194713');
    }
};