module.exports = async ({ client, user, interaction, dados }) => {

    // Relação de eventos
    // 0 -> Página anterior
    // 1 -> Próxima página
    let pagina = parseInt(dados.split(".")[1])
    const operador = parseInt(dados.split(".")[2])

    if (operador)
        pagina++
    else
        pagina--

    return require("../../../formatters/chunks/model_guild_painel")(client, user, interaction, pagina)
}