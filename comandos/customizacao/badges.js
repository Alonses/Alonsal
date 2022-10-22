const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const busca_badges = require('../../adm/data/badges.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badges')
        .setDescription('⌠👤⌡ See your badges')
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Veja suas badges',
            "es-ES": '⌠👤⌡ Ver tus insignias',
            "fr": '⌠👤⌡ Voir vos badges'
        }),
    async execute(client, interaction) {

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.usuarios.getUser(interaction.user.id)

        // Procurando pelas badges antes do comando
        if (user.badges.badge_list.length < 1 && !user.badges.badge_list)
            return interaction.reply({ content: `:mag: | ${diversao[9]["error_1"]}`, ephemeral: true })

        const embed = new EmbedBuilder()
            .setTitle(`> ${diversao[9]["suas_badges"]}`)
            .setColor(user.misc.embed)
            .setDescription(busca_badges(client, 'all', interaction.user.id, interaction))
            .setFooter({ text: diversao[9]["rodape"] })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}