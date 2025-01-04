module.exports = ({ client, user, alvo, valor }) => {

    // Decifrando para texto legível
    const anotacao = client.decifer(valor.text)

    const nome_label = anotacao.length > 15 ? `${anotacao.slice(0, 25)}...` : anotacao
    const emoji_label = valor.concluded ? client.emoji("mc_approve") : client.emoji(40)
    const valor_label = `${alvo}|${client.decifer(valor.uid)}.${valor.timestamp}`

    const descricao_label = `${client.tls.phrase(user, "util.tarefas.criacao")} ${new Date(valor.timestamp * 1000).toLocaleString("pt-BR")} | ${valor.concluded ? client.tls.phrase(user, "util.tarefas.finalizada") : client.tls.phrase(user, "util.tarefas.em_aberto")}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}