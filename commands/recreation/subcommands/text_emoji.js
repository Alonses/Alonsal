module.exports = async ({ client, user, interaction, texto_entrada }) => {

    // Torna o texto nesse formato "teste😂testado😂testadamente"
    let emoji = interaction.options.getString("emoji")

    // Emoji customizado
    if (emoji.startsWith("<") && emoji.endsWith(">")) {
        const id = emoji.match(/\d{15,}/g)[0]

        emoji = client.emoji(id)

        return interaction.reply({
            content: texto_entrada.replaceAll(" ", emoji),
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }

    // Emoji padrão do discord
    interaction.reply({
        content: texto_entrada.replaceAll(" ", emoji),
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    })
}