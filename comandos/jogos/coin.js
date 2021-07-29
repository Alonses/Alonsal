module.exports = {
    name: "moeda",
    description: "Cara ou coroa?",
    aliases: [ "co" ],
    usage: ".aco cara",
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { emojis } = require('../../arquivos/json/text/emojis.json');

        let emoji_epic_embed_fail = client.emojis.cache.get(emojis.epic_embed_fail).toString();
        let emoji_dancando = client.emojis.cache.get(emojis.esqueleto_dancando).toString();

        const possibilidades = ["cara", "coroa"];
        const moeda = Math.round(Math.random());
        let escolha = "";
        
        if(typeof args[0] != "undefined")
            escolha = args[0].toLowerCase();

        if(possibilidades.indexOf(escolha) === -1 || typeof args[0] == "undefined") {
            message.channel.send('Informe cara ou coroa como `.aco cara` ou `.aco coroa` para testar sua sorte!');
            return;
        }
        
        let emoji_exib = ":coin:";

        if(moeda == 1)
            emoji_exib = ":crown:";

        if(escolha === possibilidades[moeda])
            message.channel.send("[ "+ emoji_exib +" ] Deu " + escolha + "! Você acertou! "+ emoji_dancando);
        else
            message.channel.send("[ "+ emoji_exib +" ] Deu " + possibilidades[moeda] + ", perdeu playboy "+ emoji_epic_embed_fail );
    }
};