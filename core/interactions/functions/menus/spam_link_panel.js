module.exports = async ({ client, user, interaction, dados }) => {

    // Redirecionando o evento
    require('../../chunks/spam_link_panel')({ client, user, interaction, dados })
}