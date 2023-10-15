module.exports = async ({ client, user, interaction }) => {

    // Redirecionando o evento
    require('../../../core/interactions/chunks/panel_guild_reports')({ client, user, interaction })
}