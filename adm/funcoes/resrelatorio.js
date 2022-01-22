const { writeFileSync } = require('fs');

module.exports = () => {

    const bot = {
        comandos_disparados: 0,
        exp_concedido: 0,
        msgs_lidas: 0,
        epic_embed_fails: 0
    };
    
    writeFileSync(`./arquivos/data/relatorio.json`, JSON.stringify(bot));
    delete require.cache[require.resolve(`../../arquivos/data/relatorio.json`)];
}