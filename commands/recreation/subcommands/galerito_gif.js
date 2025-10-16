const { gifs } = require("../../../files/json/gifs/galerito.json")

module.exports = async ({ client, user, interaction, user_command }) => {

    interaction.reply({
        content: gifs[client.execute("random", { intervalo: gifs })],
        flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
    })
}