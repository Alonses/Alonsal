module.exports = ({ client, user, alvo, valor }) => {

    const nome_label = valor.text.length > 15 ? `${valor.text.slice(0, 25)}...` : valor.text
    const emoji_label = valor.concluded ? client.emoji("mc_approve") : client.emoji(40)
    const valor_label = `${alvo}|${valor.uid}.${valor.timestamp}`

    const descricao_label = `${client.tls.phrase(user, "util.tarefas.criacao")} ${new Date(valor.timestamp * 1000).toLocaleString("pt-BR")} | ${valor.concluded ? client.tls.phrase(user, "util.tarefas.finalizada") : client.tls.phrase(user, "util.tarefas.em_aberto")}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}