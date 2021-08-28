module.exports = {
    name: "rasputia",
    description: "Rasputia!",
    aliases: [ "ra", "ras", "gorda" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        message.delete();
        
        const { gifs } = require("../../arquivos/json/gifs/rasputia.json");

        let num = Math.round((gifs.length - 1) * Math.random());
    
        message.channel.send(gifs[num]);
    }
};