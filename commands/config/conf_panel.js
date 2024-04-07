const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_panel")
        .setDescription("⌠🤖⌡ Painel central do Alonsal")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute({ client, user, interaction }) {

        // Verificando autoria de quem ativou o comando
        if (!client.x.owners.includes(interaction.user.id)) return

        // Redirecionando para os módulos interativos
        require('../../core/interactions/chunks/panel_geral')({ client, user, interaction })
    }
}