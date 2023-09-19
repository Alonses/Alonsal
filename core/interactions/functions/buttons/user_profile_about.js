module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])

    // Tratamento dos cliques
    // 0 -> Cancela
    // 1 -> Confirma

    if (escolha === 0) {
        user.profile.about = null
        await user.save()

        return client.tls.report(interaction, user, "menu.botoes.operacao_cancelada", true)
    }

    client.tls.report(interaction, user, "misc.perfil.perfil_atualizado", true, client.emoji("emojis_dancantes"))
}