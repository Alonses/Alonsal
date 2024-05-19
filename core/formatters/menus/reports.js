module.exports = ({ client, user, alvo, valor }) => {

    const nome_label = valor.nick ? (valor.nick.length > 20 ? `${valor.nick.slice(0, 20)}...` : valor.nick) : client.tls.phrase(user, "mode.report.apelido_desconhecido")
    const descricao_label = `${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.relatory.length < 10 ? valor.relatory : `${valor.relatory.slice(0, 10)}...`}`
    const emoji_label = client.defaultEmoji("person")
    let valor_label = `${alvo}|${valor.uid}.${valor.sid}.${pagina}`

    if (alvo === "remove_warn" || alvo == "warn_browse") valor_label = `${alvo}|${valor.uid}.${valor.sid}.${valor.timestamp}.${pagina}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}