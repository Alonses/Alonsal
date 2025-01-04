const { SlashCommandBuilder, InteractionContextType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("⌠🏆⌡ See rankings")
        .setDescriptionLocalizations({
            "de": '⌠🏆⌡ Siehe die Rangliste',
            "es-ES": '⌠🏆⌡ Ver las clasificaciones',
            "fr": '⌠🏆⌡ Voir le classement',
            "it": '⌠🏆⌡ Guarda la classifica',
            "pt-BR": '⌠🏆⌡ Veja as classificações',
            "ru": '⌠🏆⌡ См. классификацию'
        })
        .addStringOption(option =>
            option.setName("scope")
                .setNameLocalizations({
                    "de": 'umfang',
                    "es-ES": 'alcance',
                    "fr": 'portee',
                    "it": 'scopo',
                    "pt-BR": 'escopo',
                    "ru": 'тип'
                })
                .setDescription("Select an operation")
                .setDescriptionLocalizations({
                    "de": 'Wählen Sie einen Vorgang aus',
                    "es-ES": 'Seleccione una operación',
                    "fr": 'Sélectionnez une opération',
                    "it": 'Seleziona un\'operazione',
                    "pt-BR": 'Escolha uma operação',
                    "ru": 'Выберите операцию'
                })
                .addChoices(
                    { name: '👾 Server', value: 'server' },
                    { name: '🌐 Global', value: 'global' },
                    { name: '🏦 Bank', value: 'bank' }
                )
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("page")
                .setNameLocalizations({
                    "de": 'seite',
                    "es-ES": 'pagina',
                    "it": 'pagina',
                    "pt-BR": 'pagina',
                    "ru": 'страница'
                })
                .setDescription("One page to display")
                .setDescriptionLocalizations({
                    "de": 'Eine Seite zur Anzeige',
                    "es-ES": 'Una pagina para mostrar',
                    "fr": 'Une page à afficher',
                    "it": 'Una pagina da visualizzare',
                    "pt-BR": 'Uma página para exibir',
                    "ru": 'Одна страница для отображения'
                })
                .setMinValue(1))
        .addUserOption(option =>
            option.setName("user")
                .setNameLocalizations({
                    "de": 'benutzer',
                    "es-ES": 'usuario',
                    "it": 'utente',
                    "pt-BR": 'usuario',
                    "ru": 'пользователь'
                })
                .setDescription("Mention a user")
                .setDescriptionLocalizations({
                    "de": 'Erwähnen Sie einen anderen Benutzer',
                    "es-ES": 'Mencionar a otro usuario',
                    "fr": 'Mentionner un utilisateur',
                    "it": 'Menziona un altro utente',
                    "pt-BR": 'Mencione outro usuário',
                    "ru": 'Упомянуть другого пользователя'
                }))
        .setContexts(InteractionContextType.Guild),
    async execute({ client, user, interaction }) {

        if (interaction.options.getString("scope") !== "bank") {

            const defer = true
            await client.deferedReply(interaction, client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null)
            require('../../core/formatters/chunks/model_rank')({ client, user, interaction, defer })

        } else require('../../core/formatters/chunks/model_bank')({ client, user, interaction })
    }
}