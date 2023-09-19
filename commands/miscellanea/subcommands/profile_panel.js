module.exports = async ({ client, user, interaction }) => {

    // Enviando o embed para validação
    const id_alvo = interaction.user.id, operador = 0
    const embed = await client.create_profile({ client, interaction, user, id_alvo, operador })

    // Criando os botões para customizar o perfil
    const row = client.create_buttons([
        { id: "misc_profile_about", name: client.tls.phrase(user, "menu.botoes.customizar_informacoes"), type: 1, emoji: client.defaultEmoji("tools"), data: "1" }
    ], interaction)

    // Botão para remover o "Sobre mim" caso o usuário tenha escrito algo
    if (user.profile.about)
        row.components.push(client.create_buttons([
            { id: "misc_profile_about", name: client.tls.phrase(user, "menu.botoes.remover_sobre"), type: 1, emoji: client.emoji(0), data: "0" }
        ], interaction).components[0])

    if (!interaction.customId)
        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    else
        interaction.update({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
}