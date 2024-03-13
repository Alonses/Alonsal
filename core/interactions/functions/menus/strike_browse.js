module.exports = async ({ client, user, interaction, dados }) => {

    // Redirecionando o evento
    require('../../chunks/verify_strike')({ client, user, interaction, dados })
}