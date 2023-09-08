const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lastfm")
        .setDescription("⌠👤⌡ Someone's Profile on LastFM")
        .setDescriptionLocalizations({
            "de": '⌠👤⌡ Jemandes LastFM-Profil',
            "es-ES": '⌠👤⌡ Perfil de alguien en LastFM',
            "fr": '⌠👤⌡ Profil de quelqu\'un sur LastFM',
            "it": '⌠👤⌡ Profilo di qualcuno su LastFM',
            "pt-BR": '⌠👤⌡ Perfil de alguém no LastFM',
            "ru": '⌠👤⌡ Посмотреть чей-то профиль на LastFM'
        })
        .addStringOption(option =>
            option.setName("url")
                .setDescription("The username")
                .setDescriptionLocalizations({
                    "de": 'Der Nutzername',
                    "es-ES": 'El nombre de usuario',
                    "fr": 'Nom de profil',
                    "it": 'il nome utente',
                    "pt-BR": 'O nome do usuário',
                    "ru": 'Имя пользователя'
                }))
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Mention a user")
                .setDescriptionLocalizations({
                    "de": 'einen Benutzer erwähnen',
                    "es-ES": 'Mencionar a otro usuario',
                    "fr": 'Mentionner un utilisateur',
                    "it": 'Menziona un altro utente',
                    "pt-BR": 'Mencione outro usuário',
                    "ru": 'Упомянуть другого пользователя'
                })),
    menu_data: new ContextMenuCommandBuilder()
        .setName("LastFM")
        .setType(ApplicationCommandType.User),
    async execute(client, user, interaction) {

        // Redirecionando o evento
        require("../../core/formatters/chunks/model_lastfm")({ client, user, interaction })
    },
    async menu(client, user, interaction) {

        // Redirecionando o evento
        require("../../core/formatters/chunks/model_lastfm")({ client, user, interaction })
    }
}