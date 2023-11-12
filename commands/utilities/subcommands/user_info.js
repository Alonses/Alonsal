module.exports = async ({ client, user, interaction }) => {

    // Redirecionando o evento
    const autor_original = true
    require("../../../core/formatters/chunks/model_user_info")({ client, user, interaction, autor_original })
}