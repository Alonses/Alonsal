module.exports = {
    name: "jokenpo",
    description: "Jokenpô",
    aliases: [ "jkp" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        const lang = client.idioma.getLang(message.guild.id);

        const { jogos } = require('../../arquivos/idiomas/'+ lang +'.json');

        let prefix = client.prefixManager.getPrefix(message.guild.id);
            
        let jooj = ["pedra", "papel", "tesoura", "pedra"];

        if(lang === "en-us")
            jooj = ["rock", "paper", "scissors", "rock"];

        let emojis = [":rock:", ":roll_of_paper:", ":scissors:", ":rock:"];
        let player = Math.round(2 * Math.random());
        
        if(typeof args[0] != "undefined")
            player = jooj.indexOf(args[0].toLowerCase());

        if(player === -1) // Valor não encontrado
            return message.reply(jogos[3]["aviso_1"].replaceAll(".a", prefix));

        let bot = Math.round(2 * Math.random());
        let ganhador = ":thumbsdown:";

        if (player === 0) player = 3;
        if (bot === 0) bot = 3;

        if(player === 3 && bot === 1)
            player = 0;
        
        if (bot < player || (player === 1 && bot === 3)) ganhador = ":trophy:";
        if (bot === player) ganhador = ":infinity:";

        let mensagem = "Jokenpô! \n[ " + emojis[bot] + " ] Bot\n" + "[ " + emojis[player] + " ] <- Você\n[ " + ganhador +" ]";

        if(lang === "en-us")
            mensagem = "Jokenpo! \n[ " + emojis[bot] + " ] Bot\n" + "[ " + emojis[player] + " ] <- You\n[ " + ganhador +" ]";

        message.reply(mensagem);
    },
    slash_params: [{
        name: "escolha",
        description: "pedra, papel ou tesoura",
        type: 3,
        required: true
    }],
    slash(client, handler, data, params) {
        const lang = client.idioma.getLang(data.guild_id);
        const escolha = params.get("escolha");

        const { jogos } = require('../../arquivos/idiomas/'+ lang +'.json');

        let prefix = client.prefixManager.getPrefix(data.guild_id);

        let jooj = ["pedra", "papel", "tesoura", "pedra"];

        if(lang === "en-us")
            jooj = ["rock", "paper", "scissors", "rock"];

        let emojis = [":rock:", ":roll_of_paper:", ":scissors:", ":rock:"];
        let player = Math.round(2 * Math.random());

        if(typeof escolha != "undefined")
            player = jooj.indexOf(escolha.toLowerCase());

        if(player === -1) // Valor não encontrado
            return handler.postSlashMessage(data, jogos[3]["aviso_1"].replaceAll(".a", prefix));

        let bot = Math.round(2 * Math.random());
        let ganhador = ":thumbsdown:";

        if (player === 0) player = 3;
        if (bot === 0) bot = 3;

        if(player === 3 && bot === 1)
            player = 0;

        if (bot < player || (player === 1 && bot === 3)) ganhador = ":trophy:";
        if (bot === player) ganhador = ":infinity:";

        let mensagem = "Jokenpô! \n[ " + emojis[bot] + " ] Bot\n" + "[ " + emojis[player] + " ] <- Você\n[ " + ganhador +" ]";

        if(lang === "en-us")
            mensagem = "Jokenpo! \n[ " + emojis[bot] + " ] Bot\n" + "[ " + emojis[player] + " ] <- You\n[ " + ganhador +" ]";

        handler.postSlashMessage(data, mensagem);
    }
};