const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_resumo_diario")
        .setDescription("⌠🤖⌡ Veja o resumo diário de forma manual")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        if (!client.owners.includes(interaction.user.id)) return

        const embed = await require('../../core/generators/journal')({ client })
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}