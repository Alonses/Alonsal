module.exports = async ({ client, user, interaction, dados }) => {

    // Relação de eventos
    // 0 -> Página anterior
    // 1 -> Próxima página
    let pagina = parseInt(dados.split(".")[1])
    const caso = parseInt(dados.split(".")[2])
    const funcao = dados.split(".")[3]

    const operador = caso ? pagina + 1 : pagina - 1

    return require(`../../chunks/${funcao}`)({ client, user, interaction, operador })
}