const { registryVote, verifyUser } = require("../../../database/schemas/Vote")
const { createBadge } = require("../../../database/schemas/Badge")
const { busca_badges, badgeTypes } = require("../../../data/badges")

module.exports = async ({ client, user, interaction, dados }) => {

    // Bloqueia novos votos após o encerramento
    if (client.timestamp() >= 1692460800) {

        const verify_user = await verifyUser(interaction.user.id)
        let texto = client.tls.phrase(user, "inic.vote.encerrada", client.emoji("mc_approve"))

        if (verify_user)
            texto += `\n${client.tls.phrase(user, "inic.vote.encerrada_votador", client.emoji("emojis_dancantes"))}`

        return interaction.reply({
            content: texto,
            ephemeral: true
        })
    }

    const vote = dados.split(".")[1]
    const dados_voto = await registryVote(interaction.user.id)

    dados_voto.vote = vote
    dados_voto.timestamp = client.timestamp()

    await dados_voto.save()

    const all_badges = [], badges_user = await client.getUserBadges(interaction.user.id)
    let badge_bonus = ""

    // Listando todas as badges que o usuário possui
    if (badges_user.length > 0)
        badges_user.forEach(valor => {
            all_badges.push(parseInt(valor.badge))
        })

    // Atribuindo uma nova badge ao usuário
    if (!all_badges.includes(9)) {

        const badge = busca_badges(client, badgeTypes.SINGLE, 9)
        badge_bonus = `\n\n${client.replace(client.tls.phrase(user, "inic.vote.badge_concedida"), [badge.emoji, badge.name])} </badge fix:1018609879512006794>!`

        // Atribuindo a badge ao usuário
        await createBadge(interaction.user.id, 9, client.timestamp())
    }

    interaction.reply({
        content: `${client.replace(client.tls.phrase(user, "inic.vote.voto_registrado", client.emoji("emojis_dancantes")), vote)}${badge_bonus}`,
        ephemeral: true
    })
}