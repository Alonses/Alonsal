module.exports = {
    name: "piadas",
    description: "piadócas do cazalbe",
    aliases: [ "piada", "joke", "risos", "j" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { piadas } = require("../../arquivos/json/text/joke.json");
    
        message.reply(`:black_joker: | ${piadas[Math.round((piadas.length - 1) * Math.random())]}`);
    }
};