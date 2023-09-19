module.exports = async ({ client, user, interaction, dados }) => {

    // Relação de eventos
    // 0 -> Página anterior
    // 1 -> Próxima página
    let pagina = parseInt(dados.split(".")[1])
    const operador = parseInt(dados.split(".")[2])
    const funcao = dados.split(".")[3]

    if (operador)
        pagina++
    else
        pagina--

    return require(`../../../formatters/chunks/${funcao}`)(client, user, interaction, pagina)
}