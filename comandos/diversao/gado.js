module.exports = {
    name: "gado",
    description: "Teste a gadisse de alguém",
    aliases: [ "ga" ],
    usage: "gado <@>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        const { gadisissimo } = require("../../arquivos/json/text/gado.json");

        const num = Math.round((gadisissimo.length - 1) * Math.random());

        const alvo = message.mentions.users.first();

        if(typeof alvo == "undefined"){
            message.channel.send(`O SEU GADO ${message.author} :cow:, kd o @ do usuário?`);
            return;
        }

        if(alvo.id == "833349943539531806"){
            message.channel.send(`${message.author} sai pra lá seu GA :cow: DO, teste isso com outro usuário`);
            return;
        }

        if(alvo.id !== message.author.id)
            message.channel.send("O <@"+ alvo.id +"> "+ gadisissimo[num]);
        else
            message.channel.send(`Você ${message.author}`+" "+ gadisissimo[num]);
    }
};