module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar

    if (!operacao)
        return client.tls.report(interaction, user, "menu.botoes.operacao_cancelada", true, 11, interaction.customId)
}