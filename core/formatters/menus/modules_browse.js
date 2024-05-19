module.exports = ({ client, user, alvo, valor }) => {

    const nome_label = `${client.tls.phrase(user, `misc.modulo.modulo_${valor.type}`)}`
    const emoji_label = valor.stats.active ? client.emoji("mc_approve") : client.emoji("mc_oppose")
    const descricao_label = `${client.tls.phrase(user, `misc.modulo.ativacao_${valor.stats.days}`)} ${valor.stats.hour}`
    const valor_label = `${alvo}|${valor.uid}.${valor.stats.timestamp}.${valor.type}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}