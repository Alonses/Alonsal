const { AttachmentBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction, user_command }) => {

    const data = new Date()
    let num = client.execute("random", { intervalo: client.countFiles("./files/songs/faustop", "ogg") - 1 })

    if (data.getHours() === 20 && data.getMinutes() === 7)
        num = client.execute("random", { intervalo: 1, base: 1 }) > 1 ? 7 : 12

    const file = new AttachmentBuilder(`./files/songs/faustop/faustop_${num}.ogg`, { name: "faustop.ogg" })

    interaction.reply({
        files: [file],
        flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
    })
}