module.exports = async ({ client, user, interaction, dados }) => {

    // Redirecionando o evento
    require('../../chunks/verify_report')({ client, user, interaction, dados })
}