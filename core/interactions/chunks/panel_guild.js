module.exports = async ({ client, user, interaction, operador }) => {

    // Redirecionando o evento
    require('../../formatters/chunks/model_guild_panel')(client, user, interaction, operador)
}