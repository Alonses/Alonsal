const { SlashCommandBuilder } = require('discord.js')

const busca_badges = require('../../adm/data/badges.js')
const busca_emoji = require('../../adm/discord/busca_emoji.js')
const create_menus = require('../../adm/discord/create_menus.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badge')
        .setDescription('⌠👤⌡ (Un)pin your badges!')
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ (Des)Fixe suas badges!',
            "es-ES": '⌠👤⌡ (Un)pin sus insignias!',
            "fr": '⌠👤⌡ (Dé)épinglez vos badges!'
        })
        .addSubcommand(subcommand =>
            subcommand.setName('fix')
                .setNameLocalizations({
                    "pt-BR": 'fixar',
                    "es-ES": 'etiquetar',
                    "fr": 'epingler'
                })
                .setDescription('⌠👤⌡ Pin a badge to your profile')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Fixe uma badge ao seu perfil',
                    "es-ES": '⌠👤⌡ Pon una insignia en tu perfil',
                    "fr": '⌠👤⌡ Épinglez un badge sur votre profil'
                }))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setNameLocalizations({
                    "pt-BR": 'remover',
                    "es-ES": 'retirar',
                    "fr": 'retirer'
                })
                .setDescription('⌠👤⌡ Remove pinned emblem')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Remover a badge do fixado',
                    "es-ES": '⌠👤⌡ Quita la insignia',
                    "fr": '⌠👤⌡ Supprimer le badge de l\'épinglé'
                })),
    async execute(client, interaction) {

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.usuarios.getUser(interaction.user.id)

        // Validando existência de badges antes do comando
        if (user.badge_list.length < 1)
            return interaction.reply({ content: `:mag: | ${diversao[9]["error_1"]}`, ephemeral: true })

        let all_badges = []
        const badge_list = user.badge_list

        badge_list.forEach(valor => {
            all_badges.push(parseInt(Object.keys(valor)[0]))
        })

        if (interaction.options.getSubcommand() == "fix") // Menu seletor de Badges
            return interaction.reply({ content: `Qual será fixada?`, components: [create_menus(client, all_badges, interaction)], ephemeral: true })
        else {
            user.fixed_badge = null

            user.badge_list = badge_list
            client.usuarios.saveUser(user)
        }

        // Removendo a badge fixada
        interaction.reply({ content: `:medal: | Badge ${diversao[9]["badge_removida"]}`, ephemeral: true })
    }
}