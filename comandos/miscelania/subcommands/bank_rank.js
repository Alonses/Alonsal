module.exports = async ({ client, user, interaction }) => {
    await interaction.deferReply({ ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    require('../../../adm/formatadores/chunks/model_bank')({ client, user, interaction })
}