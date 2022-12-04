const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { getUser } = require("../../adm/database/schemas/User.js")
const { buildAllBadges } = require('../../adm/data/badges')

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

        return interaction.reply({ content: 'Uma ceira bem enceirada vem por aí...', ephemeral: true })

        // const user = await getUser(interaction.user.id)

        // console.log(user.badges.badge_list)

        // // Buscando as badges do usuário
        // if (user.badges.badge_list.length <= 0 || !user.badges.badge_list)
        //     return interaction.reply({ content: `:mag: | ${client.tls.phrase(client, interaction, "dive.badges.error_1")}`, ephemeral: true })

        // const embed = new EmbedBuilder()
        //     .setTitle(`> ${client.tls.phrase(client, interaction, "dive.badges.suas_badges")}`)
        //     .setColor(client.embed_color(user.misc.color))
        //     .setDescription(await buildAllBadges(client, interaction))
        //     .setFooter({ text: client.tls.phrase(client, interaction, "dive.badges.rodape") })

        // interaction.reply({ embeds: [embed], ephemeral: true })
    }
}