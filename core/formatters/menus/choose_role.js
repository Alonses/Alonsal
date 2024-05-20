module.exports = ({ client, user, alvo, valor, data }) => {

    const nome_label = valor.name.length < 20 ? valor.name : `${valor.name.slice(0, 15)}...`
    let emoji_label = client.defaultEmoji("role")
    let valor_label = `${alvo.replace("#", "_")}|${valor.id}`
    let descricao_label

    if (valor.id === "all") emoji_label = "🃏"
    if (valor.id === "none") emoji_label = client.emoji(0)

    if (alvo.includes("warn_config") || alvo.includes("strike_config")) // Definindo uma punição para as advertências e strikes
        valor_label = `${alvo.replace("#", "_")}|${valor.id}.${data.submenu.replace("x/", "")}`

    // Função com um submenu inclusa
    if (data.submenu) valor_label = `${alvo.replace("#", "_")}|${valor.id}.${data.submenu}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}