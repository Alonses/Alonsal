module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1]) || dados

    // Códigos de operação
    // 1 -> Exclusão personalizada
    // 2 -> Exclusão por níveis

    const data = {
        title: client.tls.phrase(user, "manu.data.escolher_opcoes"),
        alvo: "dados_navegar",
        values: []
    }

    if (operacao === 1 || operacao === "uni") {

        for (let i = 1; i < 10; i++) {
            data.values.push(`uni.${i}`)
        }
    } else if (operacao === 2 || operacao === "combo") {

        for (let i = 1; i < 7; i++) {
            data.values.push(`combo.${i}`)
        }
    }

    const row = client.create_buttons([
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "dados_navegar" }
    ], interaction)

    interaction.update({
        content: data.title,
        embeds: [],
        components: [client.create_menus(client, interaction, user, data), row],
        ephemeral: true
    })
}