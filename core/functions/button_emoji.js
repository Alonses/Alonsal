/**
 * Retorna emoji de acordo com o valor do botão
 * @param {any} valor
 * @returns {string}
 */

module.exports = ({ data }) => {

    const valor = data

    if (valor === true) return '✅' // Ativado
    else if (valor === false) return '⛔' // Desativado
    else if (valor != null) return '❔' // Indefinido ou outro valor
    else return '✅' // Padrão
}