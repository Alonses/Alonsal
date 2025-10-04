/**
 * Retorna emoji de tendência de temperatura
 * @param {number} nascerSol - Hora do nascer do sol
 * @param {number} porSol - Hora do pôr do sol
 * @param {number} horaAtual - Hora atual
 * @param {number} max - Temperatura máxima
 * @param {number} min - Temperatura mínima
 * @param {number} atu - Temperatura atual
 * @param {Array|String} chuvaNeve - Dados de chuva ou neve
 * @returns {string} Emoji
 */
module.exports = (nascerSol, porSol, horaAtual, max, min, atu, chuvaNeve) => {

    // Se todos os valores são iguais, temperatura estável
    if (max === min && min === atu) return '⏺️'

    // Se há chuva/neve ou está fora do período solar e com temperatura baixa
    if (nascerSol !== porSol && max !== min && min !== atu && (horaAtual < nascerSol || horaAtual > porSol || (Array.isArray(chuvaNeve) ? chuvaNeve.length > 0 : !!chuvaNeve)))
        return '🔽'

    // Se está dentro do período solar e com aumento de temperatura
    if (nascerSol !== porSol && max !== min && min !== atu && horaAtual > nascerSol && horaAtual < porSol)
        return '🔼'

    // Temperatura estável ou sem dados suficientes
    return '🔸'
}