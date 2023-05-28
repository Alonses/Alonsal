const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("data")
        .setDescription("⌠👤⌡ Everything we know about you")
        .addSubcommand(subcommand =>
            subcommand
                .setName("summary")
                .setNameLocalizations({
                    "pt-BR": 'resumo',
                    "es-ES": 'resumen',
                    "fr": 'resume',
                    "it": 'riepilogo',
                    "ru": 'все'
                })
                .setDescription("⌠👤⌡ Everything we know about you")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Tudo o que sabemos sobre você',
                    "es-ES": '⌠👤⌡ Todo lo que sabemos de ti',
                    "fr": '⌠👤⌡ Tout ce que l\'on sait sur vous',
                    "it": '⌠👤⌡ Tutto quello che sappiamo di te',
                    "ru": '⌠👤⌡ Все, что мы знаем о тебе'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("delete")
                .setNameLocalizations({
                    "pt-BR": 'excluir',
                    "es-ES": 'borrar',
                    "fr": 'supprimer',
                    "it": 'eliminare',
                    "ru": 'удалить'
                })
                .setDescription("⌠👤⌡ Delete your data on Alonsal")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Excluir seus dados no Alonsal',
                    "es-ES": '⌠👤⌡ Elimina tus datos en Alonsal',
                    "fr": '⌠👤⌡ Supprimer vos données sur Alonsal',
                    "it": '⌠👤⌡ Elimina i tuoi dati su Alonsal',
                    "ru": '⌠👤⌡ Удалите свои данные в Alonsal'
                })),
    async execute(client, user, interaction) {

        if (interaction.options.getSubcommand() === "summary") // Lista todos os dados que o bot salvou do usuário
            return require("./subcommands/data_summary")({ client, user, interaction })
        else // Menu para realizar a exclusão dos dados do usuário
            return require('../../adm/interacoes/chunks/data')({ client, user, interaction })
    }
}