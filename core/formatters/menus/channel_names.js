/**
 * Formata os dados de um canal para exibição em menus
 * @param {object} params - Parâmetros recebidos
 * @param {object} params.client - Instância do client
 * @param {object} params.user - Usuário atual
 * @param {string} params.alvo - Alvo do menu
 * @param {object} params.valor - Dados do canal
 * @param {object} params.data - Dados adicionais
 * @returns {object} Dados formatados para o menu
 */
module.exports = ({ client, user, alvo, valor, data }) => {

    // Obtém o nome do canal traduzido, se existir
    const nome_label = client.tls.phrase(user, `mode.voice_channels.nicknames.${valor.name}`)
    const emoji_label = valor?.emoji || ''

    // Monta o valor do label de forma segura
    const valor_label = `${alvo}|${client.decifer(user.uid)}.${data?.submenu || ''}.${valor?.value || ''}`

    return { nome_label, emoji_label, valor_label }
}