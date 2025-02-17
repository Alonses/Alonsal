const { AttachmentBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction, user_command }) => {

    let num = client.random(client.countFiles("./files/songs/norbit", "ogg") - 1)

    const file = new AttachmentBuilder(`./files/songs/norbit/norbit_${num}.ogg`, { name: "norbit.ogg" })

    interaction.reply({
        files: [file],
        flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
    })
}