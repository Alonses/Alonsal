const { readdirSync } = require("fs")
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

const { getUser } = require("../../adm/database/schemas/User.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('c_migrate')
        .setDescription('⌠🤖⌡ Migrar os dados para o banco de dados externo')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        // const user = await getUser(interaction.user.id)

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