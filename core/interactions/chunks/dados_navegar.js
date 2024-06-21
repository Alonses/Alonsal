module.exports = async ({ client, user, interaction }) => {

    // Redirecionando o evento
    if (interaction.customId.split(".").length === 2) require('./data')({ client, user, interaction })
}