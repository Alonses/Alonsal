const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lastfm")
        .setDescription("⌠👤⌡ Someone's Profile on LastFM")
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Perfil de alguém no LastFM',
            "es-ES": '⌠👤⌡ Perfil de alguien en LastFM',
            "fr": '⌠👤⌡ Profil de quelqu\'un sur LastFM',
            "it": '⌠👤⌡ Profilo di qualcuno su LastFM',
            "ru": '⌠👤⌡ Посмотреть чей-то профиль на LastFM'
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
        .setName("LastFM")
        .setType(ApplicationCommandType.User),
    async execute(client, user, interaction) {

        // Redirecionando o evento
        require("../../adm/formatadores/chunks/model_lastfm")({ client, user, interaction })
    },
    async menu(client, user, interaction) {

        // Redirecionando o evento
        require("../../adm/formatadores/chunks/model_lastfm")({ client, user, interaction })
    }
}