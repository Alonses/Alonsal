const { EmbedBuilder } = require("discord.js")

const morse = require('../../../files/json/text/morse.json')

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
            if (morse[texto[carac]])
                texto[carac] = `${morse[texto[carac]]} `
            else {
                texto[carac] = ""
                aviso = client.tls.phrase(user, "util.morse.caracteres")
            }
        }
    } else { // Decodificando
        texto = codificar.texto.split(" ")

        for (let carac = 0; carac < texto.length; carac++) {
            if (Object.keys(morse).find(key => morse[key] === texto[carac]))
                texto[carac] = Object.keys(morse).find(key => morse[key] === texto[carac])
        }
    }

    if (codificar.reverso) // Inverte os caracteres
        texto = texto.reverse()

    // Montando 
    let texto_ordenado = texto.join("")
    let titulo = client.tls.phrase(user, "util.morse.codificado")

    if (codificar.opera)
        titulo = client.tls.phrase(user, "util.morse.decodificado")

    if (texto_ordenado.length === 0) {
        texto_ordenado = client.tls.phrase(user, "util.morse.carac_invalidos")
        titulo = client.tls.phrase(user, "util.morse.error")
    }

    const embed = new EmbedBuilder()
        .setTitle(titulo)
        .setColor(client.embed_color(user.misc.color))
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })
        .setDescription(`\`\`\`${texto_ordenado}\`\`\``)

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