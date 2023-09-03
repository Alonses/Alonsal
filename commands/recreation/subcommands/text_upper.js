module.exports = async ({ client, user, interaction, texto_entrada }) => {

    // Torna o texto nesse formato "A A A A A A"
    interaction.reply({
        content: texto_entrada.toUpperCase().split('').join(" ").trim(),
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    })
}