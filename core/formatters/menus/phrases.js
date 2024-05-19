const { faustop, rasputia, galerito } = require('../../../files/json/text/emojis.json')

module.exports = ({ client, user, alvo, valor }) => {

    const nome_label = valor
    let emoji_label

    if (alvo === "faustop") emoji_label = client.emoji(faustop)
    else if (alvo === "norbit") emoji_label = client.emoji(rasputia)
    else emoji_label = client.emoji(galerito)

    const valor_label = `${alvo}|${user.uid}.${i}`
    const descricao_label = client.tls.phrase(user, "menu.menus.escolher_esse")

    return { nome_label, emoji_label, descricao_label, valor_label }
}