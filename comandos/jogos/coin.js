const { emojis } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "moeda",
    description: "Cara ou coroa?",
    aliases: [ "co", "coin" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        const idioma_definido = client.idioma.getLang(message.guild.id);
        const { jogos } = require('../../arquivos/idiomas/'+ idioma_definido +'.json');

        let emoji_epic_embed_fail = client.emojis.cache.get(emojis.epic_embed_fail2).toString();
        let emoji_dancando = client.emojis.cache.get(emojis.dancando_esqueleto).toString();

        let prefix = client.prefixManager.getPrefix(message.guild.id);
        if(!prefix)
            prefix = ".a";
            
        let possibilidades = ["cara", "coroa"];

        if(idioma_definido === "en-us")
            possibilidades = ["heads", "tails"];
        
        const moeda = Math.round(Math.random());
        let escolha = "";
        
        if(typeof args[0] != "undefined")
            escolha = args[0].toLowerCase();

        if(possibilidades.indexOf(escolha) === -1 || typeof args[0] == "undefined")
            return message.reply(":warning: | "+ jogos[1]["aviso_1"].replaceAll(".a", prefix));
        
        let emoji_exib = ":coin:";

        if(moeda === 1)
            emoji_exib = ":crown:";

        if(escolha === possibilidades[moeda]){ // Acertou

            let resultado = "[ "+ emoji_exib +" ] Deu " + escolha + "! Você acertou! "+ emoji_dancando;

            if(idioma_definido === "en-us")
                resultado = "[ "+ emoji_exib +" ] It gave " + escolha + "! You're right! "+ emoji_dancando;

            message.reply(resultado);
        }else{

            let resultado = "[ "+ emoji_exib +" ] Deu " + possibilidades[moeda] + ", perdeu playboy "+ emoji_epic_embed_fail;

            if(idioma_definido === "en-us")
                resultado = "[ "+ emoji_exib +" ] It gave " + possibilidades[moeda] + ", You missed "+ emoji_epic_embed_fail;

            message.reply(resultado);

        }
    }
};