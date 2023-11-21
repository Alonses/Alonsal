module.exports = async ({ client, user, interaction, dados }) => {

    // Redirecionando o evento
    require('../../chunks/verify_module.js')({ client, user, interaction, dados })
}