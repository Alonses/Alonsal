const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("conf")
        .setDescription("⌠💂⌡ Gerencie funcões do servidor")
        .addSubcommand(subcommand =>
            subcommand.setName("ticket")
                .setDescription("⌠💂⌡ (Un)Enable reporting in private channels on the server")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ (Des)Ative as denúncias em canais privados no servidor',
                    "es-ES": '⌠💂⌡ (Des)Habilitar los informes en canales privados en el servidor',
                    "fr": '⌠💂⌡ (Dé)activer les rapports dans les canaux privés sur le serveur',
                    "it": '⌠💂⌡ (Un)Abilita la segnalazione nei canali privati ​​sul server',
                    "ru": '⌠💂⌡ (Не)Включить отчеты в приватных каналах на сервере'
                })
                .addChannelOption(option =>
                    option.setName("category")
                        .setNameLocalizations({
                            "pt-BR": 'categoria',
                            "es-ES": 'categoria',
                            "fr": 'categorie',
                            "it": 'categoria',
                            "ru": 'категория'
                        })
                        .setDescription("Mention a category as a target")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Marque uma categoria como alvo',
                            "es-ES": 'Menciona una categoría como objetivo',
                            "fr": 'Mentionner une catégorie comme cible',
                            "it": 'Indica una categoria come obiettivo',
                            "ru": 'Упоминание категории в качестве цели'
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName("report")
                .setDescription("⌠💂⌡ (Dis)Enable external user reporting on the server")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ (Des)Ative os reports de usuários externos no servidor',
                    "es-ES": '⌠💂⌡ (Des)habilitar informes de usuarios externos en el servidor',
                    "fr": '⌠💂⌡ (Dés)activer les rapports d\'utilisateurs externes sur le serveur',
                    "it": '⌠💂⌡ (Dis)Abilita la segnalazione degli utenti esterni sul server',
                    "ru": '⌠💂⌡ (Отключить) Включить отчеты внешних пользователей на сервере'
                })
                .addChannelOption(option =>
                    option.setName("channel")
                        .setNameLocalizations({
                            "pt-BR": 'canal',
                            "es-ES": 'canal',
                            "fr": 'chaîne',
                            "it": 'canale',
                            "ru": 'канал'
                        })
                        .setDescription("Mention a channel")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Marque um canal como alvo',
                            "es-ES": 'Mencionar un canal como objetivo',
                            "fr": 'Mentionner une chaîne',
                            "it": 'Menzionare un canale',
                            "ru": 'упомянуть канал'
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName("log")
                .setDescription("⌠💂⌡ (Dis)Enable Server Logging")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ (Des)Ative o Log do servidor',
                    "es-ES": '⌠💂⌡ (Des)habilitar el registro del servidor',
                    "fr": '⌠💂⌡ (Dés)activer la journalisation du serveur',
                    "it": '⌠💂⌡ (Dis)Abilita la registrazione del server',
                    "ru": '⌠💂⌡ (Отключить)Включить ведение журнала сервера'
                })
                .addChannelOption(option =>
                    option.setName("channel")
                        .setNameLocalizations({
                            "pt-BR": 'canal',
                            "es-ES": 'canal',
                            "fr": 'chaîne',
                            "it": 'canale',
                            "ru": 'канал'
                        })
                        .setDescription("Mention a channel")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Marque um canal como alvo',
                            "es-ES": 'Mencionar un canal como objetivo',
                            "fr": 'Mentionner une chaîne',
                            "it": 'Menzionare un canale',
                            "ru": 'упомянуть канал'
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName("spam")
                .setDescription("⌠💂⌡ Habilitar o sistema anti-spams")
                .addChannelOption(option =>
                    option.setName("channel")
                        .setNameLocalizations({
                            "pt-BR": 'canal',
                            "es-ES": 'canal',
                            "fr": 'chaîne',
                            "it": 'canale',
                            "ru": 'канал'
                        })
                        .setDescription("Mention a channel")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Marque um canal como alvo',
                            "es-ES": 'Mencionar un canal como objetivo',
                            "fr": 'Mentionner une chaîne',
                            "it": 'Menzionare un canale',
                            "ru": 'упомянуть канал'
                        })))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(client, user, interaction) {

        const guild = await client.getGuild(interaction.guild.id)

        // Solicitando a função e executando
        require(`./subcommands/conf_${interaction.options.getSubcommand()}`)({ client, user, interaction, guild })
    }
}