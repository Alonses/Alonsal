module.exports = {
    name: "ocovale",
    description: "ocovale!",
    aliases: [ "" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
    
        message.delete();

        const ocovale = new Discord.MessageAttachment("arquivos/videos/ocovale.mp4");
        message.channel.send("A vida com Ocovale é mais deliciosa!", ocovale);
    }
}