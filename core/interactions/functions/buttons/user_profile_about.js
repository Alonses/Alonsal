module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])

    // Tratamento dos cliques
    // 0 -> Cancela
    // 1 -> Confirma

    if (escolha === 0) {

        user.profile.cache.about = null
        await user.save()

        return client.reply(interaction, {
            content: client.tls.phrase(user, "menu.botoes.operacao_cancelada", client.emoji(0)),
            embeds: [],
            components: []
        })
    }

    // Alterando o sobre do usuário
    user.profile.about = user.profile.cache.about
    user.profile.cache.about = null

    await user.save()

    client.reply(interaction, {
        content: client.tls.phrase(user, "misc.perfil.perfil_atualizado", client.emoji("emojis_dancantes")),
        embeds: [],
        components: []
    })
}