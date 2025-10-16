/**
 * Extrai links suspeitos formatados entre parênteses no texto
 * @param {object} params
 * @param {object} params.client - Instância do client (não utilizado aqui)
 * @param {object} params.data - Dados contendo o texto
 * @returns {Array<string>} Array de links extraídos
 */
module.exports = ({ client, data }) => {
    const text = data.text || ""

    // Sem texto informado
    if (text.length < 1) return []

    // Expressão regular para extrair conteúdo entre parênteses
    const regex = /\(([^)]+)\)/g
    const links = []
    let match

    while ((match = regex.exec(text)) !== null)
        links.push(match[1])

    return links
}