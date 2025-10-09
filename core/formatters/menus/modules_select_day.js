const { moduleDays } = require("../patterns/user")

module.exports = ({ client, user, alvo, valor, data }) => {

    const nome_label = `${client.tls.phrase(user, `misc.modulo.ativacao_${valor}`)}`
    const emoji_label = moduleDays[valor]
    const valor_label = `${alvo}|${user.uid}.${data.hash}.${valor}`

    return { nome_label, emoji_label, valor_label }
}