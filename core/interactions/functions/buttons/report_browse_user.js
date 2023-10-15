module.exports = async ({ client, user, interaction, dados, pagina }) => {

    // Redirecionando o evento
    require("../../chunks/panel_guild_reports")({ client, user, interaction, pagina })
}