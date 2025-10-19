module.exports = async ({ client, user, interaction, user_command }) => {

    let x = interaction.options.getInteger("x")
    let z = interaction.options.getInteger("z")

    const x_interno = x < 0 ? (15 + x) : x
    const z_interno = z < 0 ? (15 + z) : z

    const x_chunk = Math.abs(x_interno % 16)
    const z_chunk = Math.abs(z_interno % 16)

    const chunk = []
    let k = 0

    while (k < 16) {

        let linha = []
        i = 0

        while (i < 16) {
            if (x_chunk === i && z_chunk === k)
                linha.push("x")
            else
                linha.push("-")

            i++
        }

        chunk.push(linha.join(" "))
        k++
    }

    // Adicionando os textos verticais de direção
    const leste = centralizar_direcao(client.tls.phrase(user, "game.chunk.leste"), 16)
    for (let i = 0; i <= (leste.length - 1); i++)
        chunk[i] = `${chunk[i]} ${leste[i]}`

    const oeste = centralizar_direcao(client.tls.phrase(user, "game.chunk.oeste"), 16)
    for (let i = (oeste.length - 1); i >= 0; i--)
        chunk[i] = `${oeste[i]} ${chunk[i]}`

    const embed = client.create_embed({
        title: { tls: "game.chunk.titulo" },
        description: `${client.defaultEmoji("earth")} **${client.tls.phrase(user, "game.chunk.coordenadas")}:** X: \`${x}\`, Z: \`${z}\`\n\n**${client.tls.phrase(user, "game.chunk.dentro_chunk")}:** X: \`${x_chunk}\`, Z: \`${z_chunk}\`\n\`\`\`${centralizar_direcao(client.tls.phrase(user, "game.chunk.norte")).join(" ")}\n${chunk.join("\n")}\n${centralizar_direcao(client.tls.phrase(user, "game.chunk.sul")).join(" ")}\`\`\``
    }, user)

    interaction.reply({
        embeds: [embed],
        flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
    })
}

function centralizar_direcao(texto, tamanho = 18) {

    if (texto.length > tamanho) return texto.slice(0, tamanho) // corta se for maior

    const espacosTotais = tamanho - texto.length
    const espacosEsquerda = Math.floor(espacosTotais / 2)
    const espacosDireita = Math.ceil(espacosTotais / 2)

    return (' '.repeat(espacosEsquerda) + texto + ' '.repeat(espacosDireita)).split("")
}