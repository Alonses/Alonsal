const { faustop } = require('../../../files/json/text/emojis.json')

module.exports = ({ client, user, alvo, valor }) => {

    const nome_label = `Customização de perfil ${valor}`
    const emoji_label = client.emoji(faustop)
    const descricao_label = client.tls.phrase(user, "menu.botoes.mais_detalhes")
    const valor_label = `${alvo}|${user.uid}.${valor}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}