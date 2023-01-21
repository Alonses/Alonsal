const { existsSync, writeFileSync } = require('fs')

function getRelatorio() {

    const bot = {
        comandos_disparados: 0,
        exp_concedido: 0,
        msgs_lidas: 0,
        msgs_validas: 0,
        epic_embed_fails: 0,
        bufunfas: 0,
        movimentado: 0
    }

    if (existsSync(`./arquivos/data/relatorio.json`)) {
        const { comandos_disparados, exp_concedido, msgs_lidas, msgs_validas, epic_embed_fails, bufunfas, movimentado } = require(`../../arquivos/data/relatorio.json`)
        bot.comandos_disparados = comandos_disparados || 0
        bot.exp_concedido = exp_concedido || 0
        bot.msgs_lidas = msgs_lidas || 0
        bot.msgs_validas = msgs_validas || 0
        bot.epic_embed_fails = epic_embed_fails || 0
        bot.bufunfas = bufunfas || 0
        bot.movimentado = movimentado || 0
    }

    return bot
}

function resRelatorio() {

    const bot = {
        comandos_disparados: 0,
        exp_concedido: 0,
        msgs_lidas: 0,
        msgs_validas: 0,
        epic_embed_fails: 0,
        bufunfas: 0,
        movimentado: 0
    }

    writeFileSync(`./arquivos/data/relatorio.json`, JSON.stringify(bot))
    delete require.cache[require.resolve(`../../arquivos/data/relatorio.json`)]
}

function saveRelatorio(data) {
    writeFileSync(`./arquivos/data/relatorio.json`, JSON.stringify(data))
    delete require.cache[require.resolve(`../../arquivos/data/relatorio.json`)]
}

module.exports = {
    getRelatorio,
    resRelatorio,
    saveRelatorio
}