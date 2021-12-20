const { translate } = require('free-translate');
const { by639_1 } = require('iso-language-codes');

module.exports = {
    name: "traduz",
    description: "Traduza textos e palavras",
    aliases: [ "tr", "translate" ],
    usage: "<any>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        if(args.length < 2) return message.reply(":warning: | Informe o idioma e o texto para ser traduzido");

        const idioma_alvo = args[0].raw;
        args.shift();

        const mensagem = await message.reply(`:mag: | Traduzindo seu texto para \`${by639_1[idioma_alvo] || idioma_alvo}\`... aguarde um momento`);

        const translatedText = await translate(args.join(" "), { from: 'pt', to: idioma_alvo }).catch(() => {
            return message.reply(":octagonal_sign: | Houve um erro ao tentar traduzir, tente novamente");
        });

        mensagem.edit(`\`\`\`📘 | ${translatedText.slice(0, 2000)}\`\`\``);
    }
}