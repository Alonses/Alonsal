module.exports = ({ client, data }) => {

    // Substitui partes do texto por outros valores
    const string = data.string || ""
    const valores = data.valores || null // Valor ou array de valores para substituir
    const especifico = data.especifico || null // Array com valor específico a ser substituído [valor_antigo, valor_novo]

    if (!especifico) {
        if (valores && typeof valores === "object") { // Array com vários dados para alterar
            if (valores.length > 0)
                while (valores.length > 0) {
                    string = string.replace("auto_repl", valores[0])
                    valores.shift()
                }
            else // Recebendo um objeto diferente de array
                string = string.replace("auto_repl", valores)

        } else // Apenas um valor para substituição
            string = string.replaceAll("auto_repl", valores)
    } else
        string = string.replaceAll(especifico[0], especifico[1])

    return string
}