const { gifs } = require("../../../files/json/gifs/cazalbe.json")

module.exports = async ({ client, user, interaction, user_command }) => {

    interaction.reply({
        content: gifs[client.random(gifs)],
        flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
    })
}