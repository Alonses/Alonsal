module.exports = ({ client, user, alvo, valor, pagina }) => {

    const nome_label = valor.nick ? (client.decifer(valor.nick).length > 20 ? `${client.decifer(valor.nick).slice(0, 20)}...` : client.decifer(valor.nick)) : client.tls.phrase(user, "mode.report.apelido_desconhecido")
    const descricao_label = `${new Date(valor.timestamp * 1000).toLocaleString("pt-BR")} | ${valor.relatory ? (client.decifer(valor.relatory).length < 10 ? client.decifer(valor.relatory) : `${client.decifer(valor.relatory)?.slice(0, 10)}...`) : client.tls.phrase(user, "menu.invalid.description")}`
    const emoji_label = client.defaultEmoji("person")

    let valor_label = `${alvo}|${client.decifer(valor.uid)}.${client.decifer(valor.sid)}.${pagina}`
    if (alvo === "remove_warn" || alvo == "warn_browse") valor_label = `${alvo}|${client.decifer(valor.uid)}.${client.decifer(valor.sid)}.${valor.timestamp}.${pagina}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}