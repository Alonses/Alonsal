const math = require('mathjs');

module.exports = {
    name: "calculadora",
    description: "calcula alguma operação matemática",
    aliases: [ "calc", "sum", "cal" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){

        const {utilitarios} = require('../../arquivos/idiomas/' + client.idioma.getLang(message.guild.id) + '.json');

        if(args.length < 1) return message.reply(utilitarios[17]["aviso_1"]);
        
        let operacao = "";

        try{
            args.forEach(value => {
                operacao += value +" ";
            });

            operacao = operacao.slice(0, -1);
            let resultado = math.evaluate(operacao);
            let emoji_res = ":chart_with_upwards_trend:";

            if(resultado < 0)
                emoji_res = ":chart_with_downwards_trend:";
            
            message.reply(`${emoji_res} | ${utilitarios[17]["resultado"]}: \`${resultado}\``);
        }catch(err){
            message.reply(`:octagonal_sign: | ${utilitarios[17]["error"]}: \`${operacao}\``);
        }
    }
}