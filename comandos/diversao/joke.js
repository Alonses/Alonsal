module.exports = {
    name: "piadas",
    description: "piadócas do cazalbe",
    aliases: [ "piada", "joke", "risos" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
        const { piadas } = require("../../arquivos/json/text/"+ idioma_servers[message.guild.id] +"/joke.json");
    
        message.reply(":black_joker: | "+ piadas[Math.round((piadas.length - 1) * Math.random())]);
    }
};