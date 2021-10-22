module.exports = {
    name: "piadas",
    description: "piadócas do cazalbe",
    aliases: [ "piada", "joke", "risos" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { piadas } = require("../../arquivos/json/text/" + client.idioma.getLang(message.guild.id) + "/joke.json");
    
        message.reply(":black_joker: | "+ piadas[Math.round((piadas.length - 1) * Math.random())]);
    }
};