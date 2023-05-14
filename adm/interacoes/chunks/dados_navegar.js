module.exports = async ({ client, user, interaction }) => {

    if (interaction.customId.split(".").length === 2)
        return require('./data')({ client, user, interaction })
}