const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("link")
        .setDescription("⌠👤⌡ Connect your social networks to Alon")
        .setDescriptionLocalizations({
            "de": '⌠👤⌡ Verbinden Sie Ihre sozialen Netzwerke mit Alon',
            "es-ES": '⌠👤⌡ Conecta tus redes sociales a Alon',
            "fr": '⌠👤⌡ Connectez vos réseaux sociaux à Alon',
            "it": '⌠👤⌡ Collega i tuoi social network ad Alon',
            "pt-BR": '⌠👤⌡ Conecte suas redes sociais ao Alon',
            "ru": '⌠👤⌡ Подключите свои социальные сети к Алонсал'
        })
        .addStringOption(option =>
            option.setName("platform")
                .setNameLocalizations({
                    "de": 'plattform',
                    "es-ES": 'plataforma',
                    "fr": 'plate-forme',
                    "it": 'piattaforma',
                    "pt-BR": 'plataforma',
                    "ru": 'платформа'
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
                    { name: '🎮 Steam', value: 'steam' },
                    { name: '🎶 LastFM', value: 'lastfm' },
                    { name: '🗽 Locale', value: 'locale' },
                    { name: '🚀 Pula Prédios', value: 'pula' }
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName("value")
                .setNameLocalizations({
                    "de": 'wert',
                    "es-ES": 'valor',
                    "fr": 'valeur',
                    "it": 'valore',
                    "pt-BR": 'valor',
                    "ru": 'ценить'
                })
                .setDescription("The entry value")
                .setDescriptionLocalizations({
                    "de": 'der Eingabewert',
                    "es-ES": 'El valor de entrada',
                    "fr": 'La valeur d\'entrée',
                    "it": 'Il valore di entrata',
                    "pt-BR": 'O valor de entrada',
                    "ru": 'значение входа'
                })
                .setRequired(true)),
    async execute({ client, user, interaction }) {

        // Redirecionando para a opção respectiva
        require(`./subcommands/link_${interaction.options.getString("platform")}`)({ client, user, interaction })
    }
}