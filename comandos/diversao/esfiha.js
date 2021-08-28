module.exports = {
    name: "esfiha",
    description: "Esfihas do grande rogério!",
    aliases: [ "sf", "sfiha" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        message.delete();
        
        message.channel.send(`Vai uma esfiha ae? :yum: :yum: :yum:`);
        message.channel.send('https://tenor.com/view/gil-das-esfihas-galerito-esfiha-meme-brasil-gif-21194713');
    }
};