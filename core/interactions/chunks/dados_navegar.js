module.exports = async ({ client, user, interaction }) => {

    if (interaction.customId.split(".").length === 2) // Redirecionando o evento
        require('./data')({ client, user, interaction })
}