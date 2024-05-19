const { busca_badges } = require("../../data/user_badges")

const { badgeTypes } = require("../patterns/user")

module.exports = ({ client, user, alvo, valor }) => {

    const badge = busca_badges(client, badgeTypes.SINGLE, valor)

    const nome_label = badge.name
    const emoji_label = badge.emoji
    const descricao_label = `${client.tls.phrase(user, "dive.badges.fixar")} ${badge.name}`
    const valor_label = `${alvo}|${user.uid}.${valor}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}