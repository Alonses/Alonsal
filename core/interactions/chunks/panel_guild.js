module.exports = async ({ client, user, interaction }) => {

    // Redirecionando o evento
    require('../../formatters/chunks/model_guild_panel')(client, user, interaction, 2)
}