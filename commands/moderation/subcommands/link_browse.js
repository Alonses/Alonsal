module.exports = async ({ client, user, interaction }) => {

    // Redirecionando o evento
    const pagina = 0, dados = `${interaction.user.id}.2`
    require('../../../core/interactions/functions/buttons/spam_link_button')({ client, user, interaction, dados, pagina })
}