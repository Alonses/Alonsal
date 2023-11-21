module.exports = async ({ client, user, interaction, dados }) => {

    // Redirecionando o evento
    require('../../../formatters/chunks/model_free_games')(client, user, interaction)
}