const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('c_update')
        .setDescription('⌠🤖⌡ Atualizar a versão de dados dos usuários')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        if (client.owners[0] !== interaction.user.id) return

        // Atualiza o formato dos dados de usuário para a ultima versão
        client.usuarios.updateData()

        interaction.reply({ content: `:sparkle: | Dados atualizados para a versão mais recente`, ephemeral: true })
    }
}