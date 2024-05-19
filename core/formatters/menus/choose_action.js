const { loggerMap } = require("../patterns/guild")

module.exports = ({ client, user, alvo, valor }) => {

    const nome_label = `${loggerMap[valor.type]} ${client.tls.phrase(user, `menu.events.${valor.type}`)}`
    const emoji_label = valor.status ? client.emoji("mc_approve") : client.emoji("mc_oppose")
    const valor_label = `${alvo.replace("#", "_")}|${valor.type}.${valor.id_alvo}`
    const descricao_label = client.tls.phrase(user, "menu.menus.escolher_esse")

    return { nome_label, emoji_label, descricao_label, valor_label }
}