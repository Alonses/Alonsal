module.exports = {
    name: "curiosidades",
    description: "Curiosidades aleatórias",
    aliases: [ "curio", "c" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { MessageAttachment } = require('discord.js');
        let imagem = "";

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        
        const { curiosidades } = require("../../arquivos/json/text/"+ idioma_servers[message.guild.id] +"/curio.json");
        const num = Math.round((curiosidades.length - 1) * Math.random());
        
        let key = Object.keys(curiosidades[num]);
                
        if(curiosidades[num][key] !== null)
           imagem = new MessageAttachment(curiosidades[num][key]);

        message.channel.send(":clipboard: | "+ key, imagem);
    }
};