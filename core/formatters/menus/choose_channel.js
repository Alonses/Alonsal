module.exports = ({ client, user, alvo, valor }) => {

    const nome_label = valor.name.length < 20 ? valor.name : `${valor.name.slice(0, 15)}...`
    const valor_label = `${alvo.replace("#", "_")}|${valor.id}`

    let emoji_label = client.defaultEmoji("channel")
    let descricao_label

    // Usado para remover o canal
    if (valor.id === "none") emoji_label = client.emoji(0)

    return { nome_label, emoji_label, descricao_label, valor_label }
}