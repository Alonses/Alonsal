module.exports = async ({ client, user, interaction }) => {

    // Redirecionando o evento
    const pagina = 0
    require('../../../core/interactions/chunks/remove_report')({ client, user, interaction, pagina })
}