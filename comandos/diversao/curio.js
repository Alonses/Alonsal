const { curiosidades } = require("../../arquivos/json/text/curio.json");
let lista = [];

module.exports = {
    name: "curiosidades",
    description: "Curiosidades aleatórias",
    aliases: [ "curio", "c" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message) {

        if (lista.length === curiosidades.length) lista = [];
        
        do {
            alvo = Math.round((curiosidades.length - 1) * Math.random());
        } while(lista.includes(alvo));

        lista.push(alvo);

        let key = Object.keys(curiosidades[alvo]);
        
        if (curiosidades[alvo][key] === null)
            message.channel.send(`:clipboard: | ${key}`);
        else {
            const link_extra = curiosidades[alvo][key];

            message.channel.send(`:clipboard: | ${key}`).then(message => { message.channel.send(link_extra)});
        }
    }
};