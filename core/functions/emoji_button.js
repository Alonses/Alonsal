/**
 * Retorna emoji de acordo com o valor do botão
 * @param {any} valor
 * @returns {string}
 */
const emoji_button = (valor) => {
    if (valor === true) return '✅' // Ativado
    if (valor === false) return '⛔' // Desativado
    if (valor != null) return '❔' // Indefinido ou outro valor
    return '✅' // Padrão
}

/**
 * Retorna tipo do botão para uso em componentes
 * @param {any} dado
 * @returns {number} 2 = ativo, 1 = desativado
 */
const type_button = (dado) => {

    // true -> Ativado (2), false -> Desativado (1), padrão: 2
    if (dado === false) return 1
    return 2
}

module.exports.emoji_button = emoji_button
module.exports.type_button = type_button