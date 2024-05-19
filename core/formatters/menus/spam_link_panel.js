module.exports = ({ client, user, alvo, valor }) => {

    const emoji_label = "🔗"
    const valor_label = `${alvo}|${valor.sid}.${valor.timestamp}.${pagina}`
    const nome_label = valor.link.length > 20 ? `${valor.link.slice(0, 18)}...` : valor.link
    const descricao_label = `${client.tls.phrase(user, "mode.link_suspeito.registrado_em")} ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}