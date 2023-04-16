const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { buildAllBadges } = require('../../adm/data/badges')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("badges")
        .setDescription("⌠👤⌡ See your badges")
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Veja suas badges',
            "es-ES": '⌠👤⌡ Ver tus insignias',
            "fr": '⌠👤⌡ Voir vos badges',
            "it": '⌠👤⌡ Guarda i tuoi badge',
            "ru": '⌠👤⌡ Смотрите свои значки'
        }),
    async execute(client, user, interaction) {

        const badges = await client.getUserBadges(interaction.user.id)

        // Buscando as badges do usuário
        if (badges.length <= 0)
            return interaction.reply({ content: `:mag: | ${client.tls.phrase(user, "dive.badges.error_1")}`, ephemeral: true })

        const embed = new EmbedBuilder()
            .setTitle(`> ${client.tls.phrase(user, "dive.badges.suas_badges")}`)
            .setColor(client.embed_color(user.misc.color))
            .setDescription(await buildAllBadges(client, user, badges))
            .setFooter({ text: client.tls.phrase(user, "dive.badges.rodape") })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}