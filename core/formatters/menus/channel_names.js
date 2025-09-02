module.exports = ({ client, user, alvo, valor }) => {

    let nome_label = client.tls.phrase(user, `mode.voice_channels.nicknames.${valor.name}`), emoji_label = valor.emoji, descricao_label
    let valor_label = `${alvo}|${client.decifer(user.uid)}.${valor.value}`

    return { nome_label, emoji_label, descricao_label, valor_label }
}