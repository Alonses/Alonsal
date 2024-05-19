const { moduleDays } = require("../patterns/user")

module.exports = ({ client, user, alvo, valor }) => {

    const nome_label = `${client.tls.phrase(user, `misc.modulo.ativacao_${valor}`)}`
    const emoji_label = moduleDays[valor]
    const valor_label = `${alvo}|${user.uid}.${data.timestamp}.${valor}`
    let descricao_label

    return { nome_label, emoji_label, descricao_label, valor_label }
}