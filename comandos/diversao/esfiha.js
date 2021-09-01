module.exports = {
    name: "esfiha",
    description: "Esfihas do grande rogério!",
    aliases: [ "sf", "sfiha" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const permissions = message.channel.permissionsFor(message.client.user);
        
        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
        
        message.channel.send(`Vai uma esfiha ae? :yum: :yum: :yum:`, gif_esfiha);
        message.channel.send('https://tenor.com/view/gil-das-esfihas-galerito-esfiha-meme-brasil-gif-21194713');
    }
};