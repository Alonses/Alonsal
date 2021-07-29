module.exports = {
    name: "gado",
    description: "Teste a gadisse de alguém",
    aliases: [ "ga" ],
    usage: "gado <@>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        const { gadisissimo } = require("../../arquivos/json/text/gado.json");

        if(typeof args[0] != "undefined" && args[0].includes("<@")){
            const num = Math.round((gadisissimo.length - 1) * Math.random());

            const gado = args[0];
            const alvo = gado.replace("!", "");
        
            if(alvo === "<@833349943539531806>"){
                message.channel.send(`${message.author} sai pra lá seu GA :cow: DO, teste isso com outro usuário`);
                return;
            }

            if(alvo !== `${message.author}`)
                message.channel.send("O "+ gado +" "+ gadisissimo[num]);
            else
                message.channel.send(`Você ${message.author}`+" "+ gadisissimo[num]);
        }else
            message.channel.send(`O SEU GADO ${message.author} :cow:, kd o @ do usuário?`);
    }
};