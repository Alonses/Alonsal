const { banMessageEraser } = require("../patterns/timeout")

module.exports = ({ client, user, alvo, valor }) => {

    let nome_label, descricao_label
    let emoji_label = client.defaultEmoji("time")
    let valor_label = `${alvo}|${i + 1}`

    if (data.submenu) // Função com um submenu inclusa
        valor_label = `${alvo}|${i + 1}.${data.submenu}`

    // Exibindo apenas o número
    if (alvo === "guild_spam_strikes") nome_label = valor
    else nome_label = client.tls.phrase(user, `menu.times.${valor}`)

    // Usado para a quantidade de repetências dos warns
    if (alvo === "guild_spam_strikes") valor_label = `${alvo}|${valor}`

    if (alvo.includes("ban_eraser")) { // Usado para o tempo de exclusão das mensagens ao ser banido
        nome_label = client.tls.phrase(user, `menu.network.${banMessageEraser[valor]}`)
        valor_label = `${alvo}|${valor}`

        if (valor === 0) emoji_label = client.emoji(0)
    }

    return { nome_label, emoji_label, descricao_label, valor_label }
}