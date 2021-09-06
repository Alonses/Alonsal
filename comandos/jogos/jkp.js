module.exports = {
    name: "jokenpo",
    description: "Jokenpô",
    aliases: [ "jkp" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { jogos } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        let idioma_definido = idioma_servers[message.guild.id];

        let jooj = ["pedra", "papel", "tesoura", "pedra"];

        if(idioma_definido == "en-us")
            jooj = ["rock", "paper", "scissors", "rock"];

        let emojis = [":rock:", ":roll_of_paper:", ":scissors:", ":rock:"];
        let player = Math.round(2 * Math.random());
        
        if(typeof args[0] != "undefined")
            player = jooj.indexOf(args[0].toLowerCase());

        if(player === -1){
            message.lineReply(jogos[3]["aviso_1"]);
            return;
        }

        let bot = Math.round(2 * Math.random());
        let ganhador = ":thumbsdown:";

        if (player === 0) player = 3;
        if (bot === 0) bot = 3;

        if(player === 3 && bot === 1)
            player = 0;
        
        if (bot < player || (player === 1 && bot === 3)) ganhador = ":trophy:";
        if (bot === player) ganhador = ":infinity:";

        mensagem = "Jokenpô! \n[ " + emojis[bot] + " ] Bot\n" + "[ " + emojis[player] + " ] <- Você\n[ " + ganhador +" ]";

        if(idioma_definido == "en-us")
            mensagem = "Jokenpo! \n[ " + emojis[bot] + " ] Bot\n" + "[ " + emojis[player] + " ] <- You\n[ " + ganhador +" ]";

        message.lineReply(mensagem);
    }
};