module.exports = {
    name: "jailson",
    description: "Jailson",
    aliases: [ "ja", "urso", "oco" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        message.delete();
        
        const { gifs } = require("../../arquivos/json/gifs/jailson.json");

        let num = Math.round((gifs.length - 1) * Math.random());
    
        message.channel.send(gifs[num]);
    }
};