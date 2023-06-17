const { emojis_dancantes } = require('../../../../arquivos/json/text/emojis.json')

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])

    // Tratamento dos cliques
    // 0 -> Cancela
    // 1 -> Confirma

    if (escolha === 0) {
        user.profile.about = null
        await user.save()

        return interaction.reply({ content: ":o: | Operação cancelada.", components: [], embeds: [], ephemeral: true })
    }

    interaction.update({ content: `${client.emoji(emojis_dancantes)} | Seu perfil foi atualizado!`, components: [], ephemeral: true })
}