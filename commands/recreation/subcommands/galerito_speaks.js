const { AttachmentBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction }) => {

    const num = client.random(client.countFiles("./files/songs/galerito", "ogg") - 1)

    const file = new AttachmentBuilder(`./files/songs/galerito/galerito_${num}.ogg`, { name: "galerito.ogg" })

    interaction.reply({
        files: [file],
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    })
}