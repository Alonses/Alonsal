const { banMessageEraser } = require("../patterns/timeout")

module.exports = ({ client, user, alvo, valor, data, i }) => {

    let nome_label, descricao_label
    let emoji_label = client.defaultEmoji("time")
    let valor_label = `${alvo}|${i + 1}`

    // Usado para a quantidade de repetências dos warns
    if (data.raw) valor_label = `${alvo}|${valor}`

    if (data.submenu) // Função com um submenu inclusa
        valor_label = `${alvo}|${i + 1}.${data.submenu}`

    if (data.submenu && data.raw)
        valor_label = `${alvo}|${valor}.${data.submenu}`

    // Exibindo apenas o número
    if (data.raw) nome_label = `${valor}`
    else {
        valor_label = `${alvo}|${valor.split(".")[0]}`
        nome_label = client.tls.phrase(user, `menu.times.${valor.split(".")[1]}`)

        if (data.submenu)
            valor_label = `${alvo}|${valor.split(".")[0]}.${data.submenu}`
    }

    if (alvo.includes("ban_eraser")) { // Usado para o tempo de exclusão das mensagens ao ser banido
        nome_label = client.tls.phrase(user, `menu.network.${banMessageEraser[valor]}`)
        valor_label = `${alvo}|${valor}`

        if (valor === 0) emoji_label = client.emoji(0)
    }

    return { nome_label, emoji_label, descricao_label, valor_label }
}