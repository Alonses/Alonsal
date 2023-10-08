module.exports = async ({ client, user, interaction }) => {

    // Redirecionando o evento
    require('../../../core/interactions/chunks/remove_report')({ client, user, interaction })
}