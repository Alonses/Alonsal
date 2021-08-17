module.exports = {
    name: "ocovale",
    description: "ocovale!",
    aliases: [ "covale" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const ocovale = new Discord.MessageAttachment("arquivos/videos/ocovale.mp4");
        message.channel.send("A vida com Ocovale é mais deliciosa!", ocovale);

        message.delete();
    }
}