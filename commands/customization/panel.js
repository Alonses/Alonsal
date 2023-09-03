const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setNameLocalizations({
            "pt-BR": 'painel',
            "fr": 'panneau',
            "it": 'pannello',
            "ru": 'панель'
        })
        .setDescription("⌠👤⌡ Control my functions")
        .addSubcommand(subcommand =>
            subcommand
                .setName("pessoal")
                .setDescription("⌠👤⌡ Control my functions")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Controle minhas funções',
                    "es-ES": '⌠👤⌡ Controlar mis funciones',
                    "fr": '⌠👤⌡ Contrôler mes fonctions',
                    "it": '⌠👤⌡ Controllare le mie funzioni',
                    "ru": '⌠👤⌡ контролировать мои функции'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("guild")
                .setDescription("⌠💂⌡ Control my functions")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Controle minhas funções',
                    "es-ES": '⌠💂⌡ Controlar mis funciones',
                    "fr": '⌠💂⌡ Contrôler mes fonctions',
                    "it": '⌠💂⌡ Controllare le mie funzioni',
                    "ru": '⌠💂⌡ контролировать мои функции'
                })),
    async execute(client, user, interaction) {

        if (interaction.options.getSubcommand() === "pessoal")
            return require('../../core/formatters/chunks/model_painel')(client, user, interaction)
        else
            return require('../../core/formatters/chunks/model_guild_painel')(client, user, interaction)
    }
}