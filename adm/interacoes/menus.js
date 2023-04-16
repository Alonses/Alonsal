const { AttachmentBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../../adm/data/badges')

const { clear_data } = require('../../adm/data/update_data')


module.exports = async ({ client, user, interaction }) => {

    const escolha = interaction.values[0]

    if (interaction.customId === `select_badges_${interaction.user.id}`) {

        // Fixando a badge escolhida pelo usuário
        user.misc.fixed_badge = escolha

        user.save()
        let new_badge = busca_badges(client, badgeTypes.SINGLE, parseInt(escolha))

        interaction.update({ content: `${new_badge.emoji} | Badge \`${new_badge.name}\` ${client.tls.phrase(user, "dive.badges.badge_fixada")}`, components: [], ephemeral: true })

    } else if (interaction.customId === `select_fausto_${interaction.user.id}`) {

        // Enviando uma das frases do faustão selecionada pelo menu
        const file = new AttachmentBuilder(`./arquivos/songs/faustop/faustop_${escolha}.ogg`, { name: "faustop.ogg" })

        interaction.update({ content: "", files: [file], components: [], ephemeral: user?.conf.ghost_mode || false })

    } else if (interaction.customId === `select_norbit_${interaction.user.id}`) {

        // Enviando uma das frases do filme Norbit selecionada pelo menu
        const file = new AttachmentBuilder(`./arquivos/songs/norbit/norbit_${escolha}.ogg`, { name: "norbit.ogg" })

        interaction.update({ content: "", files: [file], components: [], ephemeral: user?.conf.ghost_mode || false })

    } else if (interaction.customId === `select_data_${interaction.user.id}`) {

        // Excluindo dados do usuário
        clear_data(user, escolha)

        return
    }
}