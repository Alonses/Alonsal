module.exports = async ({ client, user, interaction, texto_entrada, user_command }) => {

    // Torna o texto nesse formato "A A A A A A"
    interaction.reply({
        content: texto_entrada.toUpperCase().split('').join(" ").trim(),
        ephemeral: client.decider(user?.conf.ghost_mode || user_command, 0)
    })
}