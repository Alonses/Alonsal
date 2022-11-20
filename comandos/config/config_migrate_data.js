const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

const { migrateUsers } = require("../../adm/database/schemas/User.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('c_migrate')
        .setDescription('⌠🤖⌡ Migrar os dados para o banco de dados externo')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        interaction.deferReply()

        await migrateUsers()
            .then(() => {
                interaction.editReply(`:satellite: | Migração para o banco de dados concluída`)
            })
    }
}