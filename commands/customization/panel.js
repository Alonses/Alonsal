const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setNameLocalizations({
            "fr": 'panneau',
            "it": 'pannello',
            "pt-BR": 'painel',
            "ru": 'панель'
        })
        .setDescription("⌠👤⌡ Control my functions")
        .addSubcommand(subcommand =>
            subcommand
                .setName("personal")
                .setNameLocalizations({
                    "de": 'personliches',
                    "fr": 'personnel',
                    "it": 'personnel',
                    "pt-BR": 'pessoal',
                    "ru": 'личная'
                })
                .setDescription("⌠👤⌡ Control my functions")
                .setDescriptionLocalizations({
                    "de": '⌠👤⌡ Kontrolliere meine Ressourcen',
                    "es-ES": '⌠👤⌡ Controlar mis funciones',
                    "fr": '⌠👤⌡ Contrôler mes fonctions',
                    "it": '⌠👤⌡ Controllare le mie funzioni',
                    "pt-BR": '⌠👤⌡ Controle minhas funções',
                    "ru": '⌠👤⌡ контролировать мои функции'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("guild")
                .setDescription("⌠💂⌡ Control my functions")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Kontrolliere meine Ressourcen',
                    "es-ES": '⌠💂⌡ Controlar mis funciones',
                    "fr": '⌠💂⌡ Contrôler mes fonctions',
                    "it": '⌠💂⌡ Controllare le mie funzioni',
                    "pt-BR": '⌠💂⌡ Controle minhas funções',
                    "ru": '⌠💂⌡ контролировать мои функции'
                })),
    async execute(client, user, interaction) {

        if (interaction.options.getSubcommand() === "personal")
            return require('../../core/formatters/chunks/model_user_panel')(client, user, interaction)
        else
            return require('../../core/formatters/chunks/model_guild_panel')(client, user, interaction)
    }
}