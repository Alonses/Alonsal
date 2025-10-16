const { AttachmentBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction, user_command }) => {

    const num = client.execute("random", { intervalo: client.countFiles("./files/songs/galerito", "ogg") - 1 })

    const file = new AttachmentBuilder(`./files/songs/galerito/galerito_${num}.ogg`, { name: "galerito.ogg" })

    interaction.reply({
        files: [file],
        flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
    })
}