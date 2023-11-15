module.exports = async ({ client, user, interaction, dados, pagina }) => {

    // Redirecionando o evento
    require("../../chunks/panel_guild_browse_warns")({ client, user, interaction, pagina })
}