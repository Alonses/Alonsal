const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const {buildAllBadges} = require('../../adm/data/badges');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badges')
        .setDescription('⌠👤⌡ See your badges')
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Veja suas badges',
            "es-ES": '⌠👤⌡ Ver tus insignias',
            "fr": '⌠👤⌡ Voir vos badges',
            "it": '⌠👤⌡ Guarda i tuoi badge'
        }),
    async execute(client, interaction) {

        const user = client.usuarios.getUser(interaction.user.id)

        // Procurando pelas badges antes do comando
        if (user.badges.badge_list.length < 1 && !user.badges.badge_list)
            return interaction.reply({ content: `:mag: | ${client.tls.phrase(client, interaction, "dive.badges.error_1")}`, ephemeral: true })

        const embed = new EmbedBuilder()
            .setTitle(`> ${client.tls.phrase(client, interaction, "dive.badges.suas_badges")}`)
            .setColor(user.misc.embed)
            .setDescription(buildAllBadges(client, interaction))
            .setFooter({ text: client.tls.phrase(client, interaction, "dive.badges.rodape") })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}