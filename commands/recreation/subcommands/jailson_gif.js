const { gifs } = require("../../../files/json/gifs/jailson.json")

module.exports = async ({ client, user, interaction, user_command }) => {

    interaction.reply({
        content: gifs[client.random(gifs)],
        ephemeral: client.decider(user?.conf.ghost_mode || user_command, 0)
    })
}