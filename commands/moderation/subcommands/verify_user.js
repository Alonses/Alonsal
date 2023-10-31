module.exports = async ({ client, user, interaction }) => {

    // Redirecionando o evento
    require('../../../core/interactions/chunks/verify_user')({ client, user, interaction })
}