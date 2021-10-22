module.exports = {
    name: "gado",
    description: "Teste a gadisse de alguém",
    aliases: [ "ga" ],
    usage: "gado <@>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const lang = client.idioma.getLang(message.guild.id);

        const { diversao } = require('../../arquivos/idiomas/' + lang + '.json');
        const { gadisissimo } = require("../../arquivos/json/text/" + lang + "/gado.json");

        const num = Math.round((gadisissimo.length - 1) * Math.random());

        const alvo = message.mentions.users.first();

        if(typeof alvo == "undefined"){
            message.channel.send(diversao[3]["gado"] +` ${message.author} :cow:, `+ diversao[3]["error_1"]);
            return;
        }

        if(client.user.id === alvo.id){
            message.channel.send(`${message.author} `+ diversao[3]["error_2"]);
            return;
        }

        if(alvo.id !== message.author.id)
            if(lang === "pt-br")
                message.channel.send("O <@"+ alvo.id +"> "+ gadisissimo[num]);
            else
                message.channel.send("The <@"+ alvo.id +"> "+ gadisissimo[num]);
        else
            if(lang === "pt-br")
                message.channel.send(`Você ${message.author}`+" "+ gadisissimo[num]);
            else
                message.channel.send(`You ${message.author}`+" "+ gadisissimo[num]);
    }
};