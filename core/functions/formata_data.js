const { months } = require("../formatters/patterns/general")

/**
 * Converte uma data no formato "DD MM YYYY" para timestamp (segundos)
 * @param {string} data - Data no formato "DD MM YYYY"
 * @returns {number|string} Timestamp em segundos ou "0" se inválido
 */
module.exports = ({ client, data }) => {

    if (!data.ano || typeof data.ano !== "string") return "0"

    const partes = data.ano.split(" ")
    if (partes.length !== 3) return "0"

    let [dia, mes, ano] = partes

    // Converte mês textual para numérico, se necessário
    if (months[mes]) mes = months[mes]

    // Cria a data e retorna timestamp em segundos
    const dateObj = new Date(`${ano} ${mes} ${dia}`)
    if (isNaN(dateObj.getTime())) return "0"

    return Math.floor(dateObj.getTime() / 1000)
}