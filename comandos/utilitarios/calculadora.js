const math = require('mathjs');

module.exports = {
    name: "calculadora",
    description: "calcula alguma operação matemática",
    aliases: [ "calc", "sum", "cal" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){

        const {utilitarios} = require('../../arquivos/idiomas/' + client.idioma.getLang(message.guild.id) + '.json');

        if(args.length < 3 && !args[0].includes("!")){
            if(args[0].includes("!")){

                let fatorial = 1;
                let num = parseInt(args[0].replace("!", ""));

                for(let i = 1; i < num + 1; i++){
                    fatorial *= i;
                }

                return message.reply(`${utilitarios[17]["resultado"]}: \`${fatorial}\``);;
            }else
                return message.reply(utilitarios[17]["aviso_1"]);
        }else{

            let operacao = "";

            try{
                args.forEach(value => {
                    operacao += value +" ";
                });

                operacao = operacao.slice(0, -1);
                let resultado = math.eval(operacao);
                let emoji_res =  ":chart_with_upwards_trend:";

                if(resultado < 0)
                    emoji_res = ":chart_with_downwards_trend:";

                if(operacao === "2 - 1" || operacao === "1 - 2")
                    return message.reply(`:chart_with_upwards_trend: | ${utilitarios[17]["resultado"]}: \`3\``);

                message.reply(`${emoji_res} | ${utilitarios[17]["resultado"]}: \`${resultado}\``);
            }catch(err){
                message.reply(`:octagonal_sign: | ${utilitarios[17]["error"]}: \`${operacao}\``);
            }
        }
    }
}