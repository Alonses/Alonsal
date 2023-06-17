module.exports = async ({ client, user, interaction }) => {

    // Enviando o embed para validação
    const id_alvo = interaction.user.id, operador = 0
    const embed = await client.create_profile({ client, interaction, user, id_alvo, operador })

    // Criando os botões para a cor customizada
    const row = client.create_buttons([{ id: "custom_profile_about", name: "Customizar informações", type: 1, emoji: client.defaultEmoji("tools"), data: "1" }, { id: "custom_profile_about", name: "Remover sobre", type: 1, emoji: client.emoji(0), data: "0" }], interaction)

    interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
}