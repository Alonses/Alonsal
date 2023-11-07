module.exports = async ({ client, user, interaction }) => {

    // Redirecionando o evento
    require('../../../core/formatters/chunks/model_charada')(client, user, interaction)
}