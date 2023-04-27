const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const { migrateCharadas } = require('../../adm/database/schemas/Charadas')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_migrate")
        .setDescription("⌠🤖⌡ Migrar os dados para o banco de dados em nuvem")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        await interaction.deferReply({ ephemeral: true })

        await migrateCharadas(client)
            .then(() => {
                interaction.editReply({ content: `:satellite: | Migração para o banco de dados concluída`, ephemeral: true })
            })

        // interaction.deferReply()

        // await migrateUsers()
        //     .then(() => {
        //         interaction.editReply(`:satellite: | Migração para o banco de dados concluída`)
        //     })
    }
}