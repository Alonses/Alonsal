module.exports = {
    name: "piadas",
    description: "piadócas do cazalbe",
    aliases: [ "piada", "joke", "risos" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { piadas } = require("../../arquivos/json/text/joke.json");

        const num = Math.round((piadas.length - 1) * Math.random());
        message.channel.send(":black_joker: "+ piadas[num]);
    }
};