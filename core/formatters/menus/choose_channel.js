module.exports = ({ client, user, alvo, valor }) => {

    let nome_label

    if (valor.name?.tls) nome_label = client.tls.phrase(valor.name.alvo, valor.name.tls)
    else nome_label = valor.name

    nome_label = nome_label.length < 20 ? nome_label : `${nome_label.slice(0, 15)}...`
    const valor_label = `${alvo.replace("#", "_")}|${valor.id}`

    let emoji_label = client.defaultEmoji("channel")
    let descricao_label

    // Usado para remover o canal
    if (valor.id === "none") emoji_label = client.emoji(0)
    if (valor.emoji) emoji_label = valor.emoji

    return { nome_label, emoji_label, descricao_label, valor_label }
}