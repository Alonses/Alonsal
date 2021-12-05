const { piadas } = require("../../arquivos/json/text/joke.json");
let lista = [];

module.exports = {
    name: "piadas",
    description: "Piadócas do cazalbe",
    aliases: [ "piada", "joke", "risos", "j" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        if(lista.length == piadas.length) lista = [];

        do{
            alvo = Math.round((piadas.length - 1) * Math.random());
        }while(lista.includes(alvo));

        lista.push(alvo);
                
        message.reply(`:black_joker: | ${piadas[alvo]}`);
    }
};