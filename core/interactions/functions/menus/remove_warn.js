module.exports = async ({ client, user, interaction, dados }) => {

    // Redirecionando o evento
    require('../../chunks/remove_warn')({ client, user, interaction, dados })
}