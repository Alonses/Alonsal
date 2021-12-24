const { contras } = require('../../arquivos/json/text/superjkp.json');

module.exports = {
    name: "superjokenpo",
    description: "Super jokenpô",
    aliases: [ "sjkp" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        const lang = client.idioma.getLang(message.guild.id);
        const { jogos } = require(`../../arquivos/idiomas/${lang}.json`);
        const prefix = client.prefixManager.getPrefix(message.guild.id);
                
        const emojis = ["rock", "roll_of_paper", "scissors", "fire", "snake", "man_running", "christmas_tree", "wolf", "sponge", "wind_blowing_face", "ocean", "dragon_face", "smiling_imp", "zap", "gun"];
        let escolhas = ["pedra", "papel", "tesoura", "fogo", "cobra", "humano", "arvore", "lobo", "esponja", "ar", "agua", "dragao", "capeta", "raio", "arma"];
        
        if(lang === "en-us")
            escolhas = ["rock", "paper", "scissors", "fire", "snake", "human", "tree", "wolf", "sponge", "air", "water", "dragon", "devil", "lightning", "gun"];
        
        if(args.length < 1) return message.reply(`${jogos[5]["aviso_1"]}\n\`\`\`fix\n${escolhas.join(", ")}\`\`\``.replaceAll(".a", prefix));

        let bot = [];
        let vitorias = 0;
        let percas = 0;
        let jogadas = lang === "pt-br" ? "Bot    ||   Você" : "Bot    ||   You";
        
        qtd_entradas = args.length > 10 ? 10 : args.length; // Limita a jogada em 10 por vez

        for(let i = 0; i < qtd_entradas; i++){
            bot.push(Math.round((escolhas.length - 1) * Math.random()));
        }

        let sinal_partida;
        for(let i = 0; i < qtd_entradas; i++){
            if(escolhas.indexOf(args[i].raw.toLowerCase()) === -1) // Entrada não encontrada, cancela o jogo
                return message.reply(`:octagonal_sign: | ${jogos[5]["error_1"]} ( \`${args[i].raw.toLowerCase()}\` )`);

            let item_contra = contras[escolhas.indexOf(args[i].raw.toLowerCase())].split(",");
            for(let x = 0; x < item_contra.length; x++){
                item_contra[x] = parseInt(item_contra[x]);
            }
            
            if(item_contra.includes(bot[i])){ // Perdeu
                percas++;
                sinal_partida = '>';
            }else if(bot[i] !== escolhas.indexOf(args[i].raw.toLowerCase())){ // Diferente
                vitorias++;
                sinal_partida = '<';
            }else
                sinal_partida = '=';

            jogadas += `\n| :${emojis[bot[i]]}:  ${sinal_partida}  :${emojis[escolhas.indexOf(args[i].raw.toLowerCase())]}: |`;
        }

        jogadas += `\n| ${("0" + percas).substr(-2)}   x   ${("0" + vitorias).substr(-2)} |`;
        ganhador = percas === vitorias ? `:infinity:` : percas > vitorias ? `:thumbsdown:` : `:trophy:` ; 

        let mensagem = `Jokenpô! \n${jogadas}\n|       ${ganhador}       |`;

        message.reply(mensagem);

        // 0 - Pedra      14, 1, 9, 10, 11, 12, 13
        // 1 - Papel      2, 3, 4, 5, 6, 7, 8
        // 2 - Tesoura    3, 0, 14, 13, 12, 11, 10
        // 3 - Fogo       0, 14, 13, 12, 11, 10, 9
        // 4 - Cobra      2, 3, 0, 14, 13, 12, 11
        // 5 - Humano     4, 2, 3, 0, 14, 13, 12
        // 6 - Arvore     5, 4, 2, 3, 0, 14, 13
        // 7 - Lobo       6, 5, 4, 2, 3, 0, 14
        // 8 - Esponja    7, 6, 5, 4, 2, 3, 0
        // 9 - Ar         1, 8, 7, 6, 5, 4, 2
        // 10 - Agua      9, 1, 8, 7, 6, 5, 4
        // 11 - Dragao    10, 9, 1, 8, 7, 6, 5
        // 12 - Capeta    11, 10, 9, 1, 8, 7, 6
        // 13 - Raio      12, 11, 10, 9, 8, 1, 7
        // 14 - Arma      13, 12, 11, 10, 9, 8, 1
    }
};