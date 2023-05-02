const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("curiosidade")
        .setDescription("⌠😂|🇧🇷⌡ Uma curiosidade aleatória"),
    async execute(client, user, interaction) {

        require('../../adm/formatadores/chunks/model_curiosidades')({ client, user, interaction })
    }
}