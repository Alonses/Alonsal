module.exports = async ({ client, user, interaction }) => {

    // Enviando o embed para validação
    const id_user = interaction.user.id, operador = 0
    const embed = await client.create_profile({ interaction, user, id_user, operador })

    // Criando os botões para customizar o perfil
    const botoes = [{ id: "misc_profile_about", name: { tls: "menu.botoes.customizar_informacoes" }, type: 0, emoji: client.defaultEmoji("tools"), data: "1" }]

    // Botão para remover o "Sobre mim" caso o usuário tenha escrito algo
    if (user.profile.about)
        botoes.push({ id: "misc_profile_about", name: { tls: "menu.botoes.remover_sobre" }, type: 0, emoji: client.emoji(0), data: "0" })

    client.reply(interaction, {
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction, user)],
        flags: "Ephemeral"
    })
}