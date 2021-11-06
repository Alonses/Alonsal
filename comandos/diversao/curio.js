const { curiosidades } = require("../../arquivos/json/text/curio.json");

module.exports = {
    name: "curiosidades",
    description: "Curiosidades aleatórias",
    aliases: [ "curio", "c" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const num = Math.round((curiosidades.length - 1) * Math.random());
        let key = Object.keys(curiosidades[num]);
        
        if(curiosidades[num][key] === null)
            message.channel.send(`:clipboard: | ${key}`);
        else{
            const link_extra = curiosidades[num][key];

            message.channel.send(`:clipboard: | ${key}`).then(message => { message.channel.send(link_extra)});
        }
    }
};