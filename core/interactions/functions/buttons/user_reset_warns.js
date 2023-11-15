const { getUserWarns } = require("../../../database/schemas/Warns")

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])
    const id_alvo = dados.split(".")[2]

    // Tratamento dos cliques
    // 0 -> Cancela
    // 1 -> Confirma
    // 2 -> Acesso aos botões deste paínel

    if (escolha === 1) {

        // Removendo os warns do usuário no servidor
        const user_warns = await getUserWarns(id_alvo, interaction.guild.id)
        user_warns.total = 0

        await user_warns.save()
    }

    if (escolha === 2) {

        // Criando os botões para o menu de remoção de warns
        const row = client.create_buttons([
            { id: "user_reset_warns", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1|${id_alvo}` },
            { id: "user_reset_warns", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: `0|${id_alvo}` }
        ], interaction)

        // Listando os botões para confirmar e cancelar a operação
        return interaction.update({
            components: [row]
        })
    }

    const id_cache = id_alvo
    require('../../chunks/verify_user')({ client, user, interaction, id_cache })
}