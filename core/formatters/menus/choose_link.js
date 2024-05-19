module.exports = ({ client, user, alvo, valor }) => {

    const nome_label = valor.name.length > 20 ? `${valor.name.slice(0, 18)}...` : valor.name
    const emoji_label = valor.network.link ? client.emoji(44) : client.emoji("mc_oppose")
    const descricao_label = valor.network.link ? client.tls.phrase(user, "mode.network.linkado") : client.tls.phrase(user, "mode.network.nao_linkado")
    const valor_label = `${alvo.replace("#", "_")}|${valor.sid}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}