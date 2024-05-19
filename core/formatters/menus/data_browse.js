module.exports = ({ client, user, alvo, valor }) => {

    const nome_label = client.tls.phrase(user, `manu.data.selects.${valor}`)
    const emoji_label = client.defaultEmoji("paper")
    const descricao_label = client.tls.phrase(user, "menu.menus.escolha_mais_detalhes")
    const valor_label = `data|${user.uid}.${valor}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}