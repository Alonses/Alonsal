const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setNameLocalizations({
            "pt-BR": 'perfil'
        })
        .setDescription("⌠🎉⌡ Customize seu perfil!")
        .addSubcommand(subcommand =>
            subcommand
                .setName("about")
                .setNameLocalizations({
                    "pt-BR": 'sobre'
                })
                .setDescription("⌠🎉⌡ Change your description on Alonsal")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠🎉⌡ Altere sua descrição no Alonsal'
                })
                .addStringOption(option =>
                    option.setName("description")
                        .setNameLocalizations({
                            "pt-BR": 'descrição'
                        })
                        .setDescription("What do you want to tell others?")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O que deseja contar aos outros?'
                        })
                        .setMaxLength(150)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("link")
                .setDescription("⌠👤⌡ Connect your social networks to Alonsal")
                .setDescriptionLocalizations({
                    "de": '⌠👤⌡ Verbinden Sie Ihre sozialen Netzwerke mit Alonsal',
                    "es-ES": '⌠👤⌡ Conecta tus redes sociales a Alonsal',
                    "fr": '⌠👤⌡ Connectez vos réseaux sociaux à Alonsal',
                    "it": '⌠👤⌡ Collega i tuoi social network ad Alonsal',
                    "pt-BR": '⌠👤⌡ Conecte suas redes sociais ao Alonsal',
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
                        .setRequired(true)))
    // .addSubcommand(subcommand =>
    //     subcommand
    //         .setName("panel")
    //         .setNameLocalizations({
    //             "pt-BR": 'painel',
    //         })
    //         .setDescription("⌠👤⌡ Set up your profile")
    //         .setDescriptionLocalizations({
    //             "pt-BR": '⌠👤⌡ Configure seu perfil'
    //         }))
    ,
    async execute({ client, user, interaction }) {

        // Navegando pelos módulos
        require(`./subcommands/profile_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    }
}