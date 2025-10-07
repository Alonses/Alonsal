/**
 * Calcula a diferença de tempo entre dois horários (HH:mm)
 * @param {string} entrada - Horário inicial no formato HH:mm
 * @param {string} saida - Horário final no formato HH:mm
 * @returns {number} Diferença em milissegundos
 */
module.exports = (entrada, saida) => {

    if (!entrada || !saida) return 0

    // Validação simples do formato HH:mm
    const regex = /^\d{2}:\d{2}$/
    if (!regex.test(entrada) || !regex.test(saida)) return 0

    const now = new Date()
    const ano = now.getFullYear()
    const mes = now.getMonth()
    const dia = now.getDate()

    // Cria datas para os horários
    const [h1, m1] = entrada.split(':').map(Number)
    const [h2, m2] = saida.split(':').map(Number)
    const inicio = new Date(ano, mes, dia, h1, m1)
    let fim = new Date(ano, mes, dia, h2, m2)

    // Se entrada é maior que saída, considera o próximo dia
    if (inicio > fim) fim.setDate(fim.getDate() + 1)

    return Math.abs(fim - inicio)
}