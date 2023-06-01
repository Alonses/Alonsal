module.exports = async ({ client, user, interaction, dados }) => {

    // Relação de eventos
    // 0 -> Página anterior
    // 1 -> Próxima página
    const pagina = parseInt(dados.split(".")[1])

    return require("../../../formatadores/chunks/model_guild_painel")(client, user, interaction, pagina)
}