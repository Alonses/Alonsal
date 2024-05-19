const { languagesMap } = require("../patterns/user")

module.exports = ({ client, user, alvo, valor }) => {

    let nome_label = valor.split(".")[1]
    let emoji_label = valor.split(".")[2]
    let valor_label = `${alvo}|${valor.split(".")[0]}`
    let descricao_label

    if (alvo === "guild_logger#language") {
        nome_label = languagesMap[valor][2]
        emoji_label = languagesMap[valor][3]
        valor_label = `${alvo.replace("#", "_")}|${valor}`
    }

    return { nome_label, emoji_label, descricao_label, valor_label }
}