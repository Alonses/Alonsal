const { readdirSync } = require('fs')
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_migrate")
        .setDescription("⌠🤖⌡ Migrar os dados para o banco de dados em nuvem")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        // for (const file of readdirSync(`./arquivos/data/user/`)) {
        //     const { id, lang, social, misc, badges, conquistas } = require(`../../arquivos/data/user/${file}`)

        //     if (id == user.uid) {
        //         console.log(badges.badge_list)
        //         user.badges.badge_list = badges.badge_list

        //         console.log(user.badges.badge_list)
        //         user.save()
        //     }
        // }

        // interaction.deferReply()

        // await migrateUsers()
        //     .then(() => {
        //         interaction.editReply(`:satellite: | Migração para o banco de dados concluída`)
        //     })
    }
}