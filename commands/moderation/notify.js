const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("notify")
        .setNameLocalizations({
            "pt-BR": 'notificar',
            "es-ES": 'notificar',
            "fr": 'notifier',
            "it": 'notificare',
            "ru": 'уведомление'
        })
        .setDescription("⌠💂⌡ Set up free game ads")
        .addSubcommand(subcommand =>
            subcommand.setName("config")
                .setDescription("⌠💂⌡ Configure free games ad")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Configurar o anúncio de games free',
                    "es-ES": '⌠💂⌡ Configurar anuncios de juegos gratis',
                    "fr": '⌠💂⌡ Configurer des annonces de jeux gratuites',
                    "it": '⌠💂⌡ Imposta annunci di giochi gratuiti',
                    "ru": '⌠💂⌡ Настроить рекламу бесплатных игр'
                })
                .addRoleOption(option =>
                    option.setName("role")
                        .setNameLocalizations({
                            "pt-BR": 'cargo',
                            "es-ES": 'rol',
                            "it": 'roule',
                            "ru": 'роль'
                        })
                        .setDescription("The role that will be notified")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O cargo que será notificado',
                            "es-ES": 'El rol a ser notificado',
                            "fr": 'Le role qui sera notifié',
                            "it": 'La roule da notificare',
                            "ru": 'Роль, которую нужно уведомить'
                        })
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName("channel")
                        .setNameLocalizations({
                            "pt-BR": 'canal',
                            "es-ES": 'canal',
                            "fr": 'salon',
                            "it": 'canale',
                            "ru": 'канал'
                        })
                        .setDescription("The channel that will be used")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O canal que será usado',
                            "es-ES": 'El canal que se utilizará',
                            "fr": 'Le canal qui sera utilisé',
                            "it": 'Il canale che verrà utilizzato',
                            "ru": 'Канал, который будет использоваться'
                        })
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("language")
                        .setNameLocalizations({
                            "pt-BR": 'idioma',
                            "es-ES": 'idioma',
                            "fr": 'langue',
                            "it": 'linguaggio',
                            "ru": 'язык'
                        })
                        .setDescription("The language to be used")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O idioma que será utilizado',
                            "es-ES": 'El lenguaje a utilizar',
                            "fr": 'La langue à utiliser',
                            "it": 'La lingua da usare',
                            "ru": 'Язык, который будет использоваться'
                        })
                        .addChoices(
                            { name: 'Alonsês', value: 'al-br' },
                            { name: 'English', value: 'en-us' },
                            { name: 'Español', value: 'es-es' },
                            { name: 'Français', value: 'fr-fr' },
                            { name: 'Italiano', value: 'it-it' },
                            { name: 'Português', value: 'pt-br' },
                            { name: 'Русский', value: 'ru-ru' }
                        )
                ))
        .addSubcommand(subcommand =>
            subcommand.setName("now")
                .setNameLocalizations({
                    "pt-BR": 'agora',
                    "es-ES": 'ahora',
                    "fr": 'maintenant',
                    "it": 'ora',
                    "ru": 'сейчас'
                })
                .setDescription("⌠💂⌡ Announce currently active promotions")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Anunciar promoções ativas no momento',
                    "es-ES": '⌠💂⌡ Anunciar las promociones actualmente activas',
                    "fr": '⌠💂⌡ Annoncez les promotions actuellement actives',
                    "it": '⌠💂⌡ Annunciare le promozioni attualmente attive',
                    "ru": '⌠💂⌡ Объявить об активных акциях'
                }))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(client, user, interaction) {

        // Solicitando a função e executando
        require(`./subcommands/notify_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    }
}