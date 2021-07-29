module.exports = {
    name: "ping",
    description: "Veja seu ping local",
    aliases: [ "" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        message.channel.send("O Ping está desabilitado por enquanto, mals por isso :thumbsup:");
        // const m = message.channel.send("Ping?");
        // m.edit(`Pong! Tá lagado um poco tô renderizando vídeo [ ${m.createdTimestamp - message.createdTimestamp}ms ].`);
    }
};