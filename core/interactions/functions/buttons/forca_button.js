module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])
    const id_sessao = dados.split(".")[2]

    if (operacao === 1) {
        if (!client.cached.forca.has(id_sessao))
            return interaction.reply({
                content: ":mag: | Ixi, essa sessão não existe mais... Mas você pode iniciar uma nova com o </forca:1069762590294687905>!",
                flags: "Ephemeral"
            })

        client.cached.forca_sessao.set(interaction.user.id, { uid: interaction.user.id, id_game: id_sessao })

        interaction.reply({
            content: "🎆 | Você ingressou na sessão! Envie uma letra ou a palavra inteira para tentar acertar.",
            flags: "Ephemeral"
        })
    } else {

        if (!client.cached.forca_sessao.has(interaction.user.id))
            return interaction.reply({
                content: ":detective: | Você não está em nenhuma sessão no momento... Não precisa clicar aqui! :P",
                flags: "Ephemeral"
            })

        client.cached.forca_sessao.delete(interaction.user.id)

        return interaction.reply({
            content: ":leaves: | Você foi removido da sessão, volte a jogar quando quiser com o </forca:1069762590294687905>!",
            flags: "Ephemeral"
        })
    }
}