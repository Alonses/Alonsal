module.exports = async ({ client, user, interaction }) => {
    const autor_original = true
    require("../../../core/formatters/chunks/model_user_info")({ client, user, interaction, autor_original })
}