module.exports = async ({ client, user, interaction, dados }) => {

    // Redirecionando o evento
    require('../../chunks/verify_warn')({ client, user, interaction, dados })
}