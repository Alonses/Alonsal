module.exports = async ({ client, user, interaction, user_command }) => {

    let aviso = ""

    const codificar = {
        texto: interaction.options.getString("text"),
        reverso: interaction.options.getBoolean("reverse"),
        opera: interaction.options.getString("operation")
    }

    if (!codificar.opera) // Codificando
        texto = textToBinary(codificar.texto)
    else // Decodificando
        texto = binaryToText(codificar.texto)

    texto = texto.split("")

    if (codificar.reverso) // Inverte os caracteres
        texto = texto.reverse()

    // Montando 
    let texto_ordenado = texto.join("")
    let titulo = client.tls.phrase(user, "util.binario.codificado")

    if (codificar.opera)
        titulo = client.tls.phrase(user, "util.binario.decodificado")

    // Confirma que a operação não resultou em uma string vazia
    if (texto_ordenado.replaceAll("\x00", "").length < 1) {
        texto_ordenado = client.tls.phrase(user, "util.binario.resul_vazio")
        titulo = client.tls.phrase(user, "util.binario.titulo_vazio")
    }

    const embed = client.create_embed({
        title: titulo,
        description: `\`\`\`${texto_ordenado}\`\`\``,
        author: {
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    if (aviso.length > 0)
        embed.setFooter({
            text: aviso
        })

    interaction.reply({
        embeds: [embed],
        flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
    })
        .catch(() => client.tls.reply(interaction, user, "util.binario.error_1", true, client.emoji(0)))
}

textToBinary = (str) => {
    return str.split('').map(char => {
        return char.charCodeAt(0).toString(2);
    }).join(' ')
}

binaryToText = (str) => {
    return str.split(" ").map((elem) => {
        return String.fromCharCode(parseInt(elem, 2));;
    }).join("")
}