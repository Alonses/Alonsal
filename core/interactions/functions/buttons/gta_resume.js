module.exports = async ({ client, user, interaction, dados }) => {

    // Redirecionando a operação
    require("../../../interactions/chunks/gta_resume")({ client, user, interaction })
}