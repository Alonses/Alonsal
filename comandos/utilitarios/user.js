const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("⌠👤⌡ View user details")
        .addSubcommand(subcommand =>
            subcommand
                .setName("avatar")
                .setDescription("⌠👤⌡ The user's avatar")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ O Avatar do usuário',
                    "es-ES": '⌠👤⌡ El avatar de usuario',
                    "fr": '⌠👤⌡ L\'avatar de l\'utilisateur',
                    "it": '⌠👤⌡ L\'utente avatar',
                    "ru": '⌠👤⌡ Аватар пользователя'
                })
                .addUserOption(option =>
                    option.setName("user")
                        .setNameLocalizations({
                            "pt-BR": 'usuario',
                            "es-ES": 'usuario',
                            "it": 'utente',
                            "ru": 'пользователь'
                        })
                        .setDescription("Mention a user as a target")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Marque outro usuário como alvo',
                            "es-ES": 'Mencionar a otro usuario',
                            "fr": 'Mentionner un utilisateur comme cible',
                            "it": 'Menziona un altro utente',
                            "ru": 'Упомянуть другого пользователя'
                        })))
        .addSubcommand(subcommand =>
            subcommand
                .setName("info")
                .setDescription("⌠👤⌡ User Information")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Informações do usuário',
                    "es-ES": '⌠👤⌡ Información del usuario',
                    "fr": '⌠👤⌡ Informations utilisateur',
                    "it": '⌠👤⌡ Informazioni sull\'utente',
                    "ru": '⌠👤⌡ Информация о пользователе'
                })
                .addUserOption(option =>
                    option.setName("user")
                        .setNameLocalizations({
                            "pt-BR": 'usuario',
                            "es-ES": 'usuario',
                            "it": 'utente',
                            "ru": 'пользователь'
                        })
                        .setDescription("Mention a user as a target")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Marque outro usuário como alvo',
                            "es-ES": 'Mencionar a otro usuario',
                            "fr": 'Mentionner un utilisateur comme cible',
                            "it": 'Menziona un altro utente',
                            "ru": 'Упомянуть другого пользователя'
                        })))
        .addSubcommand(subcommand =>
            subcommand
                .setName("banner")
                .setDescription("⌠👤⌡ The user's banner")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Banner do usuário',
                    "es-ES": '⌠👤⌡ Banner de usuario',
                    "fr": '⌠👤⌡ Bannière utilisateur',
                    "it": '⌠👤⌡ Bandiera dell\'utente',
                    "ru": '⌠👤⌡ пользовательский баннер'
                })
                .addUserOption(option =>
                    option.setName("user")
                        .setNameLocalizations({
                            "pt-BR": 'usuario',
                            "es-ES": 'usuario',
                            "it": 'utente',
                            "ru": 'пользователь'
                        })
                        .setDescription("Mention a user as a target")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Marque outro usuário como alvo',
                            "es-ES": 'Mencionar a otro usuario',
                            "fr": 'Mentionner un utilisateur comme cible',
                            "it": 'Menziona un altro utente',
                            "ru": 'Упомянуть другого пользователя'
                        }))),
    async execute(client, user, interaction) {

        // Solicitando a função e executando
        require(`./subcommands/user_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    }
}