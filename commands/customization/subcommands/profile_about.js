module.exports = async ({ client, user, interaction }) => {

    user.profile.cache.about = interaction.options.getString("description")
    await user.save()

    // Enviando o embed para validação
    const id_user = interaction.user.id, operador = 0
    const embed = await client.create_profile({ interaction, user, id_user, operador })

    // Exibindo a descrição temporária enviada pelo usuário
    embed.setDescription(user.profile.cache.about)

    // Criando os botões para a cor customizada
    const row = client.create_buttons([
        { id: "user_profile_about", name: { tls: "menu.botoes.confirmar" }, type: 1, emoji: client.emoji(10), data: "1" },
        { id: "user_profile_about", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: "0" }
    ], interaction, user)

    client.reply(interaction, {
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}