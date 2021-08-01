module.exports = {
    name: "briga",
    description: "Porradaria!",
    aliases: [ "b" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        message.delete();
        
        const { gifs } = require("../../arquivos/json/gifs/briga.json");

        const num = Math.round((gifs.length - 1) * Math.random());
        
        if(num === 0)
            message.channel.send("ESFIHADA!");

        message.channel.send(gifs[num]);
    }
};