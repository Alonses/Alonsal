module.exports = {
    name: "gado",
    description: "Teste a gadisse de alguém",
    aliases: [ "ga" ],
    usage: ".agado <@>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { frases_gadais } = require("../../arquivos/json/text/gado.json");

        if(typeof args[0] != "undefined" && args[0].includes("<@")){
            const num = Math.round((frases_gadais.length - 1) * Math.random());

            const gado = args[0];
            const alvo = gado.replace("!", "");
        
            if(alvo === "<@833349943539531806>"){
                message.channel.send(`${message.author} sai pra lá seu GA :cow: DO, teste isso com outro usuário`);
                return;
            }

            if(alvo !== `${message.author}`)
                message.channel.send("O "+ gado +" "+ frases_gadais[num]);
            else
                message.channel.send(`Você ${message.author}`+" "+ frases_gadais[num]);
        }else
            message.channel.send(`O SEU GADO ${message.author} :cow:, kd o @ do usuário?`);
    }
};