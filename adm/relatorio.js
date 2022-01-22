const { existsSync, mkdirSync, writeFileSync } = require('fs');
const fs = require('fs');

module.exports = async ({client, caso}) => {

    if(!existsSync(`./arquivos/data/relatorio.json`))
        mkdirSync(`./arquivos/data/relatorio.json`, { recursive: true });

    const bot = {
        comandos_disparados: 0,
        exp_concedido: 0,
        msgs_lidas: 0,
        epic_embed_fails: 0
    };

    if(existsSync(`./arquivos/data/relatorio.json`)){
        delete require.cache[require.resolve(`../arquivos/data/relatorio.json`)];
        const { comandos_disparados, exp_concedido, msgs_lidas, epic_embed_fails} = require(`../arquivos/data/relatorio.json`);
        bot.comandos_disparados = comandos_disparados;
        bot.exp_concedido = exp_concedido;
        bot.msgs_lidas = msgs_lidas;
        bot.epic_embed_fails = epic_embed_fails;
    }

    fs.readFile('./arquivos/data/ranking/ranking.txt', 'utf8', function(err, data){
        
        if(caso === "comando"){
            bot.comandos_disparados += 1;
            bot.exp_concedido += parseInt(data);
        }

        if(caso === "msg_enviada")
            bot.msgs_lidas += 1;
        
        writeFileSync(`./arquivos/data/relatorio.json`, JSON.stringify(bot));
        delete require.cache[require.resolve(`../arquivos/data/relatorio.json`)];
    });
}