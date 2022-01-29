module.exports = {
    name: "paz",
    description: "Faça amor não faça ódio",
    aliases: [ "pz" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message) {
        message.channel.send('https://tenor.com/view/galerito-gil-das-esfihas-meme-br-slondo-gif-15414263').then(() => {
            const permissions = message.channel.permissionsFor(message.client.user);

            if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
                message.delete();
        });
    },
    slash_params: [{
        name: "paz",
        description: "Demonstre paz"
    }],
    slash(client, handler, data, params) {
        handler.postSlashMessage(data, 'https://tenor.com/view/galerito-gil-das-esfihas-meme-br-slondo-gif-15414263');
    }
};