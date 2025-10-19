module.exports = ({ data }) => {

    let { intervalo, base } = data
    const { raw, ignore } = data

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