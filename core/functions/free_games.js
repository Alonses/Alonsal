const { getGames, verifyInvalidGames } = require('../database/schemas/Game')

const dispara_anuncio = require('../auto/send_announcement')

/**
 * Busca jogos gratuitos e dispara anúncio nos canais da guild
 * @param {object} params - Parâmetros recebidos
 * @param {object} params.client - Instância do client
 * @param {object} params.guild_channel - Canal da guild
 */
async function free_games({ client, guild_channel }) {
    try {
        // Verifica e remove games expirados
        await verifyInvalidGames()

        // Busca jogos salvos no banco de dados
        const objetos_anunciados = await getGames()
        if (!Array.isArray(objetos_anunciados) || objetos_anunciados.length === 0) return

        // Dispara o anúncio dos jogos gratuitos
        dispara_anuncio({ client, objetos_anunciados, guild_channel })
    } catch (error) {
        console.error('Erro ao buscar ou anunciar jogos gratuitos:', error)
    }
}

module.exports.free_games = free_games