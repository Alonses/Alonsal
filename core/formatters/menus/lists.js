module.exports = ({ client, user, alvo, valor }) => {

    const nome_label = valor.name.length > 15 ? `${valor.name.slice(0, 25)}...` : valor.name
    const emoji_label = client.defaultEmoji("paper")
    const descricao_label = client.tls.phrase(user, "util.tarefas.selecionar_lista")
    const valor_label = `${alvo}|${valor.uid}.${valor.timestamp}.${data.timestamp}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}