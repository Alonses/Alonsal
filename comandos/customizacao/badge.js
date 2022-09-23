const { SlashCommandBuilder } = require('discord.js')

const busca_badges = require('../../adm/data/badges.js')
const busca_emoji = require('../../adm/discord/busca_emoji.js')

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
                })
                .addStringOption(option =>
                    option.setName('fix')
                        .setNameLocalizations({
                            "pt-BR": 'fixar',
                            "es-ES": 'etiquetar',
                            "fr": 'epingler'
                        })
                        .setDescription('Which will fix?')
                        .setDescriptionLocalizations({
                            "pt-BR": 'Qual vai fixar?',
                            "es-ES": '¿A cuál etiquetarás?',
                            "fr": 'Lequel réparera ?'
                        })
                        .addChoices(
                            { name: 'Tester', value: '0' },
                            { name: 'Debugger', value: '1' },
                            { name: 'Programmer', value: '2' },
                            { name: 'Creator', value: '3' },
                            { name: 'Waxed', value: '4' },
                            { name: 'Donater', value: '5' }
                        )
                        .setRequired(true)))
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

        let entrada = interaction.options.data[0].options, new_badge = ""

        entrada.forEach(valor => {
            if (valor.name == "fix")
                new_badge = parseInt(valor.value)
        })

        let all_badges = []
        const badge_list = user.badge_list

        badge_list.forEach(valor => {
            all_badges.push(parseInt(Object.keys(valor)[0]))

            if (new_badge == parseInt(Object.keys(valor)[0]))
                emoji_badge = busca_emoji(client, busca_badges(client, 'single', parseInt(Object.keys(valor)[0]))[0])
        })

        // Verificando se o usuário possui a badge informada
        if (!all_badges.includes(new_badge) && interaction.options.getSubcommand() == "fix")
            return interaction.reply({ content: `:octagonal_sign: | ${diversao[9]["error_2"]}`, ephemeral: true })

        // Salvando os dados novamente para a reescrita
        if (interaction.options.getSubcommand() == "fix")
            user.fixed_badge = new_badge
        else
            user.fixed_badge = null

        user.badge_list = badge_list
        client.usuarios.saveUser(user)

        if (interaction.options.getSubcommand() == "fix") {

            const nome_badge = busca_badges(client, 'single', parseInt(new_badge))[1]

            interaction.reply({ content: `${emoji_badge} | Badge \`${nome_badge}\` ${diversao[9]["badge_fixada"]}`, ephemeral: true })
        } else // Removendo a badge fixada
            interaction.reply({ content: `:medal: | Badge ${diversao[9]["badge_removida"]}`, ephemeral: true })
    }
}