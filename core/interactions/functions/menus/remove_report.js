module.exports = async ({ client, user, interaction, dados }) => {

    // Redirecionando o evento
    require('../../chunks/remove_report')({ client, user, interaction, dados })
}