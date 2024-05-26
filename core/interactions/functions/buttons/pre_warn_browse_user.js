module.exports = async ({ client, user, interaction, dados, pagina }) => {

    dados = "0.4" // Redirecionando o evento
    require("./guild_verify_button")({ client, user, interaction, dados, pagina })
}