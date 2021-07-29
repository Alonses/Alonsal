module.exports = {
    name: "cazalbe",
    description: "Cazalbé!",
    aliases: [ "caz" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { gifs } = require("../../arquivos/json/gifs/cazalbe.json");

        let num = Math.round((gifs.length - 1) * Math.random());
    
        message.channel.send(gifs[num]);
    }
};