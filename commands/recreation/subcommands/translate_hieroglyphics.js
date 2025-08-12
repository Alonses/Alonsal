const hieroglyphics = require('../../../files/json/text/hieroglyphics.json')

module.exports = async ({ client, user, interaction, user_command }) => {

    let aviso = ""

    const codificar = {
        texto: interaction.options.getString("text"),
        reverso: interaction.options.getBoolean("reverse"),
        opera: interaction.options.getString("operation")
    }

    if (!codificar.opera) { // Codificando
        texto = codificar.texto.split('')

        for (let carac = 0; carac < texto.length; carac++) {
            if (hieroglyphics[texto[carac]])
                texto[carac] = `${hieroglyphics[texto[carac]]} `
            else {
                texto[carac] = ""
                aviso = client.tls.phrase(user, "util.hieroglifos.caracteres")
            }
        }
    } else { // Decodificando
        texto = codificar.texto.split(" ")

        for (let carac = 0; carac < texto.length; carac++) {
            if (Object.keys(hieroglyphics).find(key => hieroglyphics[key] === texto[carac]))
                texto[carac] = Object.keys(hieroglyphics).find(key => hieroglyphics[key] === texto[carac])
        }
    }

    if (codificar.reverso) // Inverte os caracteres
        texto = texto.reverse()

    // Montando 
    let texto_ordenado = texto.join("")
    let titulo = client.tls.phrase(user, "util.hieroglifos.codificado")

    if (codificar.opera)
        titulo = client.tls.phrase(user, "util.hieroglifos.decodificado")

    if (texto_ordenado.length === 0) {
        texto_ordenado = client.tls.phrase(user, "util.morse.carac_invalidos")
        titulo = client.tls.phrase(user, "util.morse.error")
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