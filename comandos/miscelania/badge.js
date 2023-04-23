const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("badge")
        .setDescription("⌠👤⌡ (Un)pin your badges!")
        .addSubcommand(subcommand =>
            subcommand.setName("fix")
                .setNameLocalizations({
                    "pt-BR": 'fixar',
                    "es-ES": 'etiquetar',
                    "fr": 'epingler',
                    "it": 'evidenziare',
                    "ru": 'носить'
                })
                .setDescription("⌠👤⌡ Pin a badge to your profile")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Fixe uma badge ao seu perfil',
                    "es-ES": '⌠👤⌡ Pon una insignia en tu perfil',
                    "fr": '⌠👤⌡ Épinglez un badge sur votre profil',
                    "it": '⌠👤⌡ Evidenzia un badge sul tuo profilo',
                    "ru": '⌠👤⌡ Добавьте значок в свой профиль'
                }))
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                .setNameLocalizations({
                    "pt-BR": 'remover',
                    "es-ES": 'retirar',
                    "fr": 'retirer',
                    "it": 'rimuovere',
                    "ru": 'удалять'
                })
                .setDescription("⌠👤⌡ Remove pinned badge")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Remover a badge do fixado',
                    "es-ES": '⌠👤⌡ Quita la insignia',
                    "fr": '⌠👤⌡ Supprimer le badge de l\'épinglé',
                    "it": '⌠👤⌡ Rimuovi il badge da appuntato',
                    "ru": '⌠👤⌡ Удалить значок профиля'
                })),
    async execute(client, user, interaction) {

        const badges = await client.getUserBadges(interaction.user.id)

        // Validando se o usuário possui badges
        if (badges.length < 1)
            return interaction.reply({ content: `:mag: | ${client.tls.phrase(user, "dive.badges.error_1")}`, ephemeral: true })

        let all_badges = []

        badges.forEach(valor => {
            all_badges.push(valor.badge)
        })

        const data = {
            alvo: "badges",
            values: all_badges
        }

        if (interaction.options.getSubcommand() === "fix") // Menu seletor de Badges
            return interaction.reply({ content: client.tls.phrase(user, "dive.badges.cabecalho_menu"), components: [client.create_menus(client, interaction, user, data)], ephemeral: true })
        else {
            user.misc.fixed_badge = null
            await user.save()
        }

        // Removendo a badge fixada
        interaction.reply({ content: `:medal: | Badge ${client.tls.phrase(user, "dive.badges.badge_removida")}`, ephemeral: true })
    }
}