const { gifs } = require("../../../files/json/gifs/rasputia.json")

module.exports = async ({ client, user, interaction }) => {

    interaction.reply({
        content: gifs[client.random(gifs)],
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    })
}