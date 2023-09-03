module.exports = async ({ client, user, interaction }) => {

    await interaction.deferReply({
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    })

    require('../../../core/formatters/chunks/model_bank')({ client, user, interaction })
}