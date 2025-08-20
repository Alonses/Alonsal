module.exports = async ({ client, user, interaction }) => {

    const row = [
        { id: "data_menu_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: '0' },
        { id: "data_button", name: { tls: "manu.data.exclusao_personalizada" }, type: 1, emoji: client.emoji(1), data: '1' },
        { id: "data_button", name: { tls: "manu.data.exclusao_niveis" }, type: 1, emoji: client.defaultEmoji("paper"), data: '2' },
        { id: "data_button", name: { tls: "menu.botoes.excluir_tudo" }, type: 1, emoji: client.emoji(13), data: '3' }
    ]

    if (interaction.customId.includes("uni") || interaction.customId.includes("combo")) {
        const dados = interaction.customId.split(".")[2]

        return require('../functions/buttons/data_button')({ client, user, interaction, dados })
    }

    client.reply(interaction, {
        content: client.tls.phrase(user, "menu.botoes.selecionar_operacao", client.defaultEmoji("paper")),
        embeds: [],
        components: [client.create_buttons(row, interaction, user)],
        flags: "Ephemeral"
    })
}