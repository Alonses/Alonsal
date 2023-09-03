module.exports = async ({ client, user, interaction, texto_entrada }) => {

    // Inverte o texto enviado
    interaction.reply({
        content: texto_entrada.split('').reverse().join(""),
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    })
}