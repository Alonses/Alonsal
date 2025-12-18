const { dailyReset } = require('../database/schemas/Bot')
const { cobra_modulo } = require('./triggers/modules')
const { servidores_inativos } = require('./triggers/guild_iddle')
const { verifica_renda_passiva } = require('./triggers/user_passive_income')

module.exports = async ({ client }) => {
    try {
        if (client.x.relatorio) {
            const embed = await require('../generators/journal')({ client })
            await client.execute('notify', { id_canal: process.env.channel_stats, conteudo: { embeds: [embed] } })
        }

        // Executando as verificações diárias em parelelo
        await Promise.all([
            servidores_inativos(client),
            cobra_modulo(client),
            verifica_renda_passiva(client)
        ])

        // Reinicia as estatísticas do relatório diário
        await dailyReset(client.id())

        // Limpa o cache de servidores inativos
        client.cached.iddleGuilds.clear()
    } catch (error) {
        console.error('Erro ao executar await_journal:', error)
    }
}