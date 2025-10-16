/**
 * Formata uma lista de valores para exibição
 * @param {object} params
 * @param {object} params.client - Instância do client (não utilizado aqui)
 * @param {object} params.data - Dados contendo valores, tamanho máximo e opção raw
 * @returns {string} Lista formatada
 */
module.exports = ({ data }) => {

    const valores = Array.isArray(data.valores) ? data.valores : []
    const tamanho_maximo = data.max
    const raw = data.raw || false

    if (valores.length === 0) return ""

    // Formata cada valor conforme opção raw
    const formatado = valores.map(v => raw ? v : `\`${v}\``)

    // Junta os valores com vírgula e "&" antes do último
    let lista = ""

    if (formatado.length === 1)
        lista = formatado[0]
    else
        lista = formatado.slice(0, -1).join(", ") + " & " + formatado[formatado.length - 1]

    // Limita o tamanho máximo, se definido
    if (tamanho_maximo && lista.length > tamanho_maximo)
        lista = `${lista.slice(0, tamanho_maximo)}...`

    return lista
}