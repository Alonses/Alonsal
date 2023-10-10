module.exports = async ({ client, user, interaction }) => {

    // Redirecionando o evento
    const pagina = 0, dados = `${interaction.user.id}.3`
    require('../../../core/interactions/functions/buttons/report_remove_user')({ client, user, interaction, dados, pagina })
}