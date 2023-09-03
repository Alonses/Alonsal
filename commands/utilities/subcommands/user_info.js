module.exports = async ({ client, user, interaction }) => {
    require("../../../core/formatters/chunks/model_user_info")(client, user, interaction)
}