module.exports = ({ client, user, alvo, valor, pagina }) => {

    let link = client.decifer(valor.link)

    const emoji_label = "🔗"
    const valor_label = `${alvo}|${valor.sid}.${valor.timestamp}.${pagina}`
    const nome_label = link.length > 20 ? `${link.slice(0, 18)}...` : link
    const descricao_label = `${client.tls.phrase(user, "mode.link_suspeito.registrado_em")} ${new Date(valor.timestamp * 1000).toLocaleString("pt-BR")}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}