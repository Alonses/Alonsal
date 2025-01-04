const { AttachmentBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction, user_command }) => {

    const file = new AttachmentBuilder("./files/songs/cazalbe.ogg")
    interaction.reply({
        files: [file],
        ephemeral: client.decider(user?.conf.ghost_mode || user_command, 0)
    })
}