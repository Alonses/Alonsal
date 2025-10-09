module.exports = ({ client, user, alvo, valor }) => {

    let nome_label = `[ ${valor.misc.scope === "guild" ? "🌐" : "👤"} ] ${client.tls.phrase(user, `misc.modulo.modulo_${valor.type}`)}`

    if (valor.type === 0)
        nome_label += ` | ${client.decifer(valor.misc.locale)}`

    const emoji_label = valor.stats.active ? client.emoji("mc_approve") : client.emoji("mc_oppose")
    const descricao_label = `${client.tls.phrase(user, `misc.modulo.ativacao_${valor.stats.days}`)} ${valor.stats.hour}`
    const valor_label = `${alvo}|${client.decifer(valor.uid)}.${valor.hash}.${valor.type}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}