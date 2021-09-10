module.exports = {
    name: "paz",
    description: "Faça amor não faça ódio",
    aliases: [ "pz" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        message.channel.send('https://tenor.com/view/galerito-gil-das-esfihas-meme-br-slondo-gif-15414263');

        const permissions = message.channel.permissionsFor(message.client.user);
        
        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
    }
};