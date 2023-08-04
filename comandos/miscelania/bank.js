const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bank")
        .setNameLocalizations({
            "pt-BR": 'banco',
            "es-ES": 'banco',
            "fr": 'banque',
            "it": 'banca',
            "ru": 'банк'
        })
        .setDescription("⌠💸⌡ See your Bufunfas")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💸⌡ Veja suas Bufunfas',
            "es-ES": '⌠💸⌡ Mira a tus Bufunfas',
            "fr": '⌠💸⌡ Voir vos Bufunfas',
            "it": '⌠💸⌡ Visualizza il tuo Bufunfa',
            "ru": '⌠💸⌡ посмотреть свой Bufunfa'
        })
        .addUserOption(option =>
            option.setName("user")
                .setNameLocalizations({
                    "pt-BR": 'usuario',
                    "es-ES": 'usuario',
                    "fr": 'user',
                    "it": 'utente',
                    "ru": 'пользователь'
                })
                .setDescription("View another user\'s bank")
                .setDescriptionLocalizations({
                    "pt-BR": 'Visualizar o banco de outro usuário',
                    "es-ES": 'Ver el banco de otro usuario',
                    "fr": 'Afficher la banque d\'un autre utilisateur',
                    "it": 'Visualizza la banca di un altro utente',
                    "ru": 'Просмотр банка другого пользователя'
                })),
    menu_data: new ContextMenuCommandBuilder()
        .setName("Bank")
        .setNameLocalizations({
            "pt-BR": 'Banco',
            "es-ES": 'Banco',
            "fr": 'Banque',
            "it": 'Banca',
            "ru": 'банк'
        })
        .setType(ApplicationCommandType.User),
    async execute(client, user, interaction) {

        // Redirecionando o evento
        require("../../adm/formatadores/chunks/model_bank")({ client, user, interaction })
    },
    async menu(client, user, interaction) {

        // Redirecionando o evento
        require("../../adm/formatadores/chunks/model_bank")({ client, user, interaction })
    },
}