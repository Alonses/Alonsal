module.exports = ({ client, user, alvo, valor }) => {

    const nome_label = valor.text.length > 15 ? `${valor.text.slice(0, 25)}...` : valor.text
    const valor_label = `${alvo}|${valor.uid}.${valor.timestamp}.${data.operador}`

    let emoji_label = valor.concluded ? client.emoji("mc_approve") : client.emoji(40)
    let descricao_label = `${client.tls.phrase(user, "util.tarefas.criacao")} ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.concluded ? client.tls.phrase(user, "util.tarefas.finalizada") : client.tls.phrase(user, "util.tarefas.em_aberto")}`

    if (alvo == "tarefas") {
        emoji_label = client.defaultEmoji("paper")
        descricao_label = `${client.tls.phrase(user, "util.tarefas.criacao")} ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")}`
    }

    return { nome_label, emoji_label, descricao_label, valor_label }
}