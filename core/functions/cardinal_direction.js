/**
 * Retorna o emoji de direção cardinal baseado em graus
 * @param {number} degrees - Ângulo em graus
 * @returns {string} Emoji da direção
 */
module.exports = (degrees) => {

    const cards = ["⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️"]

    // Validação do parâmetro
    let deg = Number(degrees)
    if (isNaN(deg)) return "❓" // Retorna interrogação se o valor não for numérico

    // Ajustando os graus para a faixa correta
    deg = ((deg % 360) + 360) % 360
    deg += 22.5
    deg = deg % 360

    const idx = Math.floor(deg / 45)
    return cards[idx]
}