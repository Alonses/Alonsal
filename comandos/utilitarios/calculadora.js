const { isInteger, forEach } = require('mathjs');
const math = require('mathjs');

module.exports = {
    name: "calculadora",
    description: "calcula alguma operação matemática",
    aliases: [ "calc", "sum", "cal" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const {utilitarios} = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        const idioma_definido = client.idioma.getLang(message.guild.id);

        if (args.length < 1) return message.reply(utilitarios[17]["aviso_1"]);

        let operacao = args.join(" ");

        if (idioma_definido !== "en-us") // Prevenindo erros por causa de vírgulas
            operacao = operacao.replaceAll(",", ".");
        else
            operacao = operacao.replaceAll(",", "");

        if (args[0].raw === "+" || args[0].raw === "-" || args[0].raw === "*" || args[0].raw === "/") {
            args.shift();
            operacao = args.join(` ${args[0].raw} `);
        }

        if (args[0].raw.includes("+") || args[0].raw.includes("-") || args[0].raw.includes("*") || args[0].raw.includes("/")) { // Operando vários itens de uma vez

            const valores_fn = [];
            args.shift();

            args.forEach(valor => {
                valores_fn.push(math.evaluate(`${valor} ${args[0].raw}`).toLocaleString('pt-BR'));
            });

            return message.reply(`:abacus: | ${utilitarios[17]["resultado"]}: \`${valores_fn.join(" ")}\``);
        }

        try {
            let resultado = math.evaluate(operacao);
            let emoji_res = ":chart_with_upwards_trend:";

            if (resultado < 0)
                emoji_res = ":chart_with_downwards_trend:";

            if (!isInteger(resultado))
                resultado = resultado.toFixed(6)

            message.reply(`${emoji_res} | ${utilitarios[17]["resultado"]}: \`${resultado.toLocaleString('pt-BR')}\``);
        } catch (err) {
            message.reply(`:octagonal_sign: | ${utilitarios[17]["error"]}: \`${operacao}\``);
        }
    }
}