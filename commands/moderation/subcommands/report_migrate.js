module.exports = async ({ client, user, interaction }) => {

    // Enviando o embed para validação
    const embed = client.create_embed({
        title: { tls: "mode.report.automatizado" },
        color: "salmao",
        description: { tls: "mode.report.descricao_automatizado" },
        footer: {
            text: { tls: "menu.botoes.selecionar_operacao" },
            iconURL: client.avatar()
        }
    }, user)

    // Criando os botões para a cor customizada
    const row = client.create_buttons([
        { id: "report_auto", name: { tls: "menu.botoes.confirmar", alvo: user }, type: 2, emoji: client.emoji(10), data: 1 },
        { id: "report_auto", name: { tls: "menu.botoes.cancelar", alvo: user }, type: 3, emoji: client.emoji(0), data: 0 }
    ], interaction)

    return interaction.reply({
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}