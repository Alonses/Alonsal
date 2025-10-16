module.exports = ({ data }) => {

    let intervalo = data.intervalo
    let base = data?.base || 0
    const raw = data?.raw || false // Retorna a chave do array ao invés do valor
    const ignore = data?.ignore || false // Ignora um valor específico

    if (typeof base === "undefined") base = 0 // Valor minimo aceitável

    if (typeof intervalo === "object") {

        // Retorna a chave do intervalo passado ao invés do indice no array
        if (raw) {

            let resultado

            do { // Entra em loop enquanto o valor for igual ao ignorado
                resultado = Object.keys(intervalo)[(base + Math.round(Object.keys(intervalo).length * Math.random())) - 1]
            } while (resultado === ignore || !resultado) // Prevenindo resultado nulo

            return resultado
        }

        intervalo = intervalo.length - 1 // Recebendo um array de dados
    }

    return base + Math.round(intervalo * Math.random())
}