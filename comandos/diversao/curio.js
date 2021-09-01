module.exports = {
    name: "curiosidades",
    description: "Curiosidades aleatórias",
    aliases: [ "curio", "c" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { MessageAttachment } = require('discord.js');
        let imagem = "";

        const { curiosidades } = require("../../arquivos/json/text/curio.json");
        const num = Math.round((curiosidades.length - 1) * Math.random());
        
        let key = Object.keys(curiosidades[num]);
        
        if(curiosidades[num][key] !== null)
           imagem = new MessageAttachment(curiosidades[num][key]);

        message.channel.send(key, imagem);
    }
};