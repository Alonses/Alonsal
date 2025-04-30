const { getCharade } = require('../../database/schemas/Charadas')

module.exports = async ({ client, user, interaction, user_command }) => {

    const res = await getCharade()
    const texto = `🃏 | ${res[0].question}\n\n${res[0].answer}`

    if (interaction)
        interaction.reply({
            content: texto,
            flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
        })
    else client.sendDM(user, { content: texto }, true)
}