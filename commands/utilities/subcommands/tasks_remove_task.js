module.exports = async ({ client, user, interaction }) => {

    // Redirecionando o evento
    const autor_original = true
    require('../../../core/interactions/chunks/tarefas_remover')({ client, user, interaction, autor_original })
}