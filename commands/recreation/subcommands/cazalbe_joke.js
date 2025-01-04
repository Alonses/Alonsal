module.exports = async ({ client, user, interaction, user_command }) => {

    // Redirecionando o evento
    require('../../../core/formatters/chunks/model_charada')({ client, user, interaction, user_command })
}