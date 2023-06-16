const { randomString } = require("../../../funcoes/random_string")

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])

    if (!operacao)
        return client.tls.report(interaction, user, "menu.botoes.operacao_cancelada", true, 11, interaction.customId)

    const opcao = randomString(5, client)
    let botoes = [opcao]

    for (let i = 0; i < 2; i++)
        botoes.push(randomString(5, client))

    botoes = shuffleArray(botoes)

    const row = client.create_buttons([{ id: "data_finalize_button", name: botoes[0], type: 1, data: `1.${define_button(opcao, botoes[0])}.${dados}` }, { id: "data_finalize_button", name: botoes[1], type: 1, data: `2.${define_button(opcao, botoes[1])}.${dados}` }, { id: "data_finalize_button", name: botoes[2], type: 1, data: `3.${define_button(opcao, botoes[2])}.${dados}` }, { id: "data_finalize_button", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: '0' }, { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "data" }], interaction)

    interaction.update({ content: client.replace(client.tls.phrase(user, "manu.data.ultima_confirmacao", 8), opcao), components: [row], embeds: [], ephemeral: true })
}

function define_button(original, atual) {
    return original === atual ? '1' : '0'
}

function shuffleArray(inputArray) {
    return inputArray.sort(() => Math.random() - 0.5)
}