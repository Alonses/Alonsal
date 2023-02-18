const { AttachmentBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../../adm/data/badges')

module.exports = async ({ client, user, interaction }) => {

    if (interaction.customId === `select_badges_${interaction.user.id}`) {

        // Fixando a badge escolhida pelo usuário
        user.misc.fixed_badge = interaction.values[0]

        user.save()
        let new_badge = busca_badges(client, badgeTypes.SINGLE, parseInt(interaction.values[0]))

        interaction.update({ content: `${new_badge.emoji} | Badge \`${new_badge.name}\` ${client.tls.phrase(user, "dive.badges.badge_fixada")}`, components: [], ephemeral: true })

    } else if (interaction.customId === `select_fausto_${interaction.user.id}`) {

        // Enviando uma das frases do faustão selecionada pelo menu
        const file = new AttachmentBuilder(`./arquivos/songs/faustop/faustop_${interaction.values[0]}.ogg`, { name: 'faustop.ogg' })

        interaction.update({ content: "", files: [file], components: [], ephemeral: user?.conf.ghost_mode || false })
    }
}