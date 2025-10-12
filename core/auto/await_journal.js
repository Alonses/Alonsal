const { dailyReset } = require('../database/schemas/Bot')

const { cobra_modulo } = require('./triggers/modules')
const { servidores_inativos } = require('./triggers/guild_iddle')
const { verifica_renda_passiva } = require('./triggers/user_passive_income')

module.exports = async ({ client }) => {

    if (client.x.relatorio) { // Envia o relatório de uso do bot diariamente caso habilitado
        const embed = await require('../generators/journal')({ client })

        await client.notify(process.env.channel_stats, { embeds: [embed] })
    }

    await servidores_inativos(client) // Verifica os servidores inativos para remover o bot automaticamente
    await dailyReset(client.id()) // Reinicia as estatítisticas do relatório diário
    await cobra_modulo(client) // Cobra pelos módulos ativos dos usuários
    await verifica_renda_passiva(client) // Verifica a renda passiva dos impulsionadores
}