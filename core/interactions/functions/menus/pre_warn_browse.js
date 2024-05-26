module.exports = async ({ client, user, interaction, dados }) => {

    // Redirecionando o evento
    require('../../chunks/verify_pre_warn')({ client, user, interaction, dados })
}