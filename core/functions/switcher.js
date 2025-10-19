module.exports = ({ data }) => {

    const { dado, operacao, operations } = data

    // Inverte o valor de botões liga/desliga
    const local = (operations[operacao].action).split(".")

    // Vasculha o objeto do servidor a procura do valor para alterar
    local.reduce((acc, key, index) => {
        if (index === local.length - 1)
            acc[key] = !acc[key]

        return acc[key]
    }, dado)

    const pagina_guia = operations[operacao].page

    return { dado, pagina_guia }
}