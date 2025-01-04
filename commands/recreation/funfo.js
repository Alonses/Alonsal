const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("alaa")
        .setDescription("⌠😂|🇧🇷⌡ Funfo?"),
    async execute({ client, user, interaction, user_command }) {

        const file = new AttachmentBuilder("./files/songs/alaa.ogg")
        interaction.reply({
            files: [file],
            flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
        })
    }
}