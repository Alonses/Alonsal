module.exports = {
    name: "curiosidades",
    description: "Curiosidades aleatórias",
    aliases: [ "curio", "c" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { curiosidades } = require("../../arquivos/json/text/curio.json");
        const num = Math.round((curiosidades.length - 1) * Math.random());
        
        let key = Object.keys(curiosidades[num]);
        
        message.channel.send(":clipboard: | "+ key);
        
        if(curiosidades[num][key] !== null)
            message.channel.send(curiosidades[num][key]);
    }
};