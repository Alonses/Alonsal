const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("steam")
        .setDescription("⌠👤⌡ Someone's Steam Profile")
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Perfil de alguém na Steam',
            "es-ES": '⌠👤⌡ Perfil de alguien en Steam',
            "fr": '⌠👤⌡ Profil Steam de quelqu\'un',
            "it": '⌠👤⌡ Profilo Steam di qualcuno',
            "ru": '⌠👤⌡ Посмотреть чей-то профиль на Steam'
        })
        .addStringOption(option =>
            option.setName("url")
                .setDescription("The username")
                .setDescriptionLocalizations({
                    "pt-BR": 'O nome do usuário',
                    "es-ES": 'El nombre de usuario',
                    "fr": 'Nom de profil',
                    "it": 'il nome utente',
                    "ru": 'Имя пользователя'
                }))
        .addUserOption(option =>
            option.setName("user")
                .setDescription("A discord user")
                .setDescriptionLocalizations({
                    "pt-BR": 'Um usuário do discord',
                    "es-ES": 'Un usuario de discord',
                    "fr": 'Un utilisateur de discord',
                    "it": 'Un utente della discord',
                    "ru": 'Дискорд-пользователь'
                })),
    menu_data: new ContextMenuCommandBuilder()
        .setName("Steam")
        .setType(ApplicationCommandType.User),
    async execute(client, user, interaction) {

        // Redirecionando o evento
        require("../../core/formatters/chunks/model_steam")({ client, user, interaction })
    },
    async menu(client, user, interaction) {

        // Redirecionando o evento
        require("../../core/formatters/chunks/model_steam")({ client, user, interaction })
    }
}