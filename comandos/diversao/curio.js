module.exports = {
    name: "curiosidades",
    description: "Curiosidades aleatórias",
    aliases: [ "curio", "c" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { MessageAttachment } = require('discord.js');
        let imagem = "";
        
        const { curiosidades } = require("../../arquivos/json/text/curio.json");
        const num = Math.round((curiosidades.length - 1) * Math.random());
        
        let key = Object.keys(curiosidades[num]);
        
        if(curiosidades[num][key] !== null && !curiosidades[num][key].includes("youtu.be")){
        imagem = new MessageAttachment(curiosidades[num][key]);

            await message.channel.send(":clipboard: | "+ key, imagem);
        }else{
            if(curiosidades[num][key] !== null)
                imagem = curiosidades[num][key];

            await message.channel.send(":clipboard: | "+ key + "\n"+ imagem);
        }
    }
};