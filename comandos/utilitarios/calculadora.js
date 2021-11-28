const { isInteger, forEach } = require('mathjs');
const math = require('mathjs');

module.exports = {
    name: "calculadora",
    description: "calcula alguma operação matemática",
    aliases: [ "calc", "sum", "cal" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){

        const {utilitarios} = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        if(args.length < 1) return message.reply(utilitarios[17]["aviso_1"]);

        let operacao = args.join(" ");
        
        if(args[0].toString() === "+" || args[0].toString() === "-" || args[0].toString() === "*" || args[0].toString() === "/"){
            let operador = args[0].toString();
            args.shift();
            operacao = args.join(` ${operador} `);
        }

        if(args[0].toString().includes("+") || args[0].toString().includes("-") || args[0].toString().includes("*") || args[0].toString().includes("/")){ // Operando vários itens de uma vez

            let valores_fn = [];
            let opera = args[0].toString();
            args.shift();

            args.forEach(valor => {
                valores_fn.push(math.evaluate(`${valor} ${opera}`).toLocaleString('pt-BR'));
            });

            return message.reply(`:abacus: | ${utilitarios[17]["resultado"]}: \`${valores_fn.join(" ")}\``);;
        }

        try{
            let resultado = math.evaluate(operacao);
            let emoji_res = ":chart_with_upwards_trend:";

            if(resultado < 0)
                emoji_res = ":chart_with_downwards_trend:";
            
            if(!isInteger(resultado))
                resultado = resultado.toFixed(6)

            message.reply(`${emoji_res} | ${utilitarios[17]["resultado"]}: \`${resultado.toLocaleString('pt-BR')}\``);
        }catch(err){
            message.reply(`:octagonal_sign: | ${utilitarios[17]["error"]}: \`${operacao}\``);
        }
    }
}