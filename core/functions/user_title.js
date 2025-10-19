/**
 * Formata título do usuário para cards de log
 * @param {object} params
 * @param {object} params.client - Instância do client
 * @param {object} params.data - Dados do usuário e configurações
 * @returns {string} Título formatado
 */
module.exports = ({ client, data }) => {

    const { user, scope, tls, emoji } = data

    if (!user) return ''

    // Define o emoji base (bot, padrão ou person)
    const baseEmoji = user.bot
        ? client.emoji("icon_integration")
        : (emoji || client.defaultEmoji("person"))

    // Define o sufixo para bots
    const botSuffix = user.bot
        ? ` ( ${user.id !== client.id()
            ? client.tls.phrase(scope, "util.user.bot")
            : client.tls.phrase(scope, "util.user.alonsal")} )`
        : ""

    // Retorna o texto formatado
    return `${baseEmoji} **${client.tls.phrase(scope, tls)}${botSuffix}**`
}