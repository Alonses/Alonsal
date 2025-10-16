/**
 * Formata um valor numérico para o locale especificado
 * @param {object} params
 * @param {object} params.client - Instância do client (não utilizado aqui)
 * @param {object} params.data - Dados contendo o valor e o locale
 * @returns {string} Valor formatado ou "0" se inválido
 */
module.exports = ({ client, data }) => {

    if (!data?.valor || isNaN(data.valor)) return "0"

    const locale = data?.locale || "pt-br"
    return Number(data.valor).toLocaleString(locale)
}