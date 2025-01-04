module.exports = ({ client, user, alvo, valor, data }) => {

    // Decifrando para texto legível
    const nome = client.decifer(valor.name)

    const nome_label = nome.length > 15 ? `${nome.slice(0, 25)}...` : nome
    const emoji_label = client.defaultEmoji("paper")
    const descricao_label = client.tls.phrase(user, "util.tarefas.selecionar_lista")
    const valor_label = `${alvo}|${client.decifer(valor.uid)}.${valor.timestamp}.${data.timestamp}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}