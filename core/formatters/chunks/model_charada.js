const { getCharada } = require('../../database/schemas/Charadas')

module.exports = async ({ client, alvo, interaction, user_command, internal_module }) => {

    const res = await getCharada()
    const texto = `🃏 | ${res[0].question}\n\n||${res[0].answer}||`

    if (interaction)
        interaction.reply({
            content: texto,
            flags: client.decider(alvo?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
        })
    else client.sendModule(alvo, { content: texto }, internal_module)
}