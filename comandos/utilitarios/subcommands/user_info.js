module.exports = async ({ client, user, interaction }) => {
    require("../../../adm/formatadores/chunks/model_user_info")(client, user, interaction)
}