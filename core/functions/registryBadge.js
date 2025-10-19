const { getUserBadges, createBadge } = require("../database/schemas/User_badges")

const { busca_badges } = require("../data/user_badges")
const { badgeTypes } = require("../formatters/patterns/user")

module.exports = async ({ client, data }) => {

    const { user, id_badge } = data
    const all_badges = [], badges_user = await getUserBadges(user.uid)

    // Listando todas as badges que o usuário possui
    if (badges_user.length > 0)
        badges_user.forEach(valor => { all_badges.push(parseInt(valor.badge)) })

    if (!all_badges.includes(id_badge)) {

        // Atribuindo a badge reporter ao usuário
        await createBadge(user.uid, id_badge, client.execute("timestamp"))
        const badge = busca_badges(client, badgeTypes.SINGLE, id_badge)

        client.execute("sendDM", { user, dados: { content: client.tls.phrase(user, "dive.badges.new_badge", client.emoji("emojis_dancantes"), [badge.name, badge.emoji]) } })
    }
}