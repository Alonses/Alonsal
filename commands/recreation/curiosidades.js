const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("curiosidade")
        .setDescription("⌠😂|🇧🇷⌡ Uma curiosidade aleatória"),
    async execute({ client, user, interaction, user_command }) {

        require('../../core/formatters/chunks/model_curiosidades')({ client, user, interaction, user_command })
    }
}