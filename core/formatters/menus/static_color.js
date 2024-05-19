const { colorsMap } = require("../patterns/user")

module.exports = ({ client, user, alvo, valor }) => {

    const emoji_label = colorsMap[valor][2]
    const valor_label = `${alvo}|${valor}`
    const nome_label = `${valor.charAt(0).toUpperCase() + valor.slice(1)}`
    let descricao_label

    return { nome_label, emoji_label, descricao_label, valor_label }
}