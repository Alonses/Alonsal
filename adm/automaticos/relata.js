const { dailyReset } = require('../database/schemas/Bot')
const { cobra_modulo } = require('./modulo')

module.exports = async ({ client }) => {

    if (!client.x.relatorio) return

    const date1 = new Date() // Ficará esperando até meia noite para executar a rotina
    const tempo_restante = ((23 - date1.getHours()) * 3600000) + ((60 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000)

    setTimeout(() => {
        gera_relatorio(client)
        requisita_relatorio(client, 86400000) // Altera o valor para sempre executar à meia-noite
    }, tempo_restante) // Executa de 1 em 1 dia
}

function requisita_relatorio(client, aguardar_tempo) {
    setTimeout(() => {
        gera_relatorio(client)
        requisita_relatorio(client, aguardar_tempo)
    }, aguardar_tempo)
}

async function gera_relatorio(client) {

    const embed = await require('../generators/relatorio')({ client })

    await client.notify(process.env.channel_stats, embed)
    await dailyReset(client.id()) // Reseta o relatório
    await cobra_modulo(client) // Cobra pelos módulos ativos pelos usuários
}