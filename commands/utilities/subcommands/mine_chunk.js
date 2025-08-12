module.exports = async ({ client, user, interaction, user_command }) => {

    const x = interaction.options.getInteger("x")
    const z = interaction.options.getInteger("z")

    const x_chunk = Math.abs(x % 16)
    const z_chunk = Math.abs(z % 16)

    const chunk = []

    let i = x < 0 ? 15 : 0
    let final = i === 15 ? 0 : 16

    while (i < final) {

        let linha = ""
        k = z < 0 ? 15 : 0

        while (k < final) {
            if (x_chunk === i && z_chunk === k)
                linha += "x "
            else
                linha += "- "

            k++
        }

        chunk.push(linha)
        i++
    }

    const embed = client.create_embed({
        title: "> Sua posição na chunk",
        description: `${client.defaultEmoji("earth")} **Coordenadas:** X: \`${x}\`, Z: \`${z}\`\n\n**Dentro da chunk:** X: \`${x_chunk}\`, Z: \`${z_chunk}\`\n\`\`\`${chunk.join("\n")}\`\`\``
    }, user)

    interaction.reply({
        embeds: [embed],
        flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
    })
}