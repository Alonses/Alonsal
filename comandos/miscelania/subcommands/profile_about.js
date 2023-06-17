module.exports = async ({ client, user, interaction }) => {

    user.profile.about = interaction.options.getString("description")
    await user.save()

    // Enviando o embed para validação
    const id_alvo = interaction.user.id, operador = 0
    const embed = await client.create_profile({ client, interaction, user, id_alvo, operador })

    // Criando os botões para a cor customizada
    const row = client.create_buttons([{ id: "profile_about", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, data: "1" }, { id: "profile_about", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: "0" }], interaction)

    interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
}