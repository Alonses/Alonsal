module.exports = async ({ client, user, interaction, texto_entrada, user_command }) => {

    // Torna o texto nesse formato "AaAaAaAaAaA"
    texto_entrada = texto_entrada.split("")

    for (let i = 0; i < texto_entrada.length; i++)
        if (i % 2 === 0 && i % 1 === 0)
            texto_entrada[i] = texto_entrada[i].toLocaleUpperCase()
        else
            texto_entrada[i] = texto_entrada[i].toLocaleLowerCase()

    interaction.reply({
        content: texto_entrada.join(""),
        flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
    })
}