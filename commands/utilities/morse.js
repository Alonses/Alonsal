const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const morse = require('../../files/json/text/morse.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("morse")
        .setDescription("⌠💡⌡ (De)code from/to morse")
        .setDescriptionLocalizations({
            "de": '⌠💡⌡ In/von Morse codieren',
            "es-ES": '⌠💡⌡ (Des)codificar de/a morse',
            "fr": '⌠💡⌡ (Dé)coder de/vers morse',
            "it": '⌠💡⌡ (Da) codice da/per morse',
            "pt-BR": '⌠💡⌡ (De)codifique do/para o morse',
            "ru": '⌠💡⌡ (Де)код в/из азбуки Морзе'
        })
        .addStringOption(option =>
            option.setName("text")
                .setNameLocalizations({
                    "es-ES": 'texto',
                    "fr": 'texte',
                    "it": 'testo',
                    "pt-BR": 'texto',
                    "ru": 'текст'
                })
                .setDescription("Write something!")
                .setDescriptionLocalizations({
                    "de": 'Schreibe etwas!',
                    "es-ES": '¡Escribe algo!',
                    "fr": 'Écris quelque chose!',
                    "it": 'Scrivi qualcosa!',
                    "pt-BR": 'Escreva algo!',
                    "ru": 'Напиши что-нибудь!'
                })
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName("reverse")
                .setNameLocalizations({
                    "de": 'umkehren',
                    "es-ES": 'reverso',
                    "fr": 'inverse',
                    "it": 'inversione',
                    "pt-BR": 'reverso'
                })
                .setDescription("Invert output result")
                .setDescriptionLocalizations({
                    "de": 'Ausgabeergebnis invertieren',
                    "es-ES": 'Invertir resultado de salida',
                    "fr": 'Inverser le résultat de sortie',
                    "it": 'invertire il risultato di output',
                    "pt-BR": 'Inverter resultado de saída',
                    "ru": 'инвертировать вывод'
                }))
        .addStringOption(option =>
            option.setName("operation")
                .setNameLocalizations({
                    "de": 'betrieb',
                    "es-ES": 'operacion',
                    "fr": 'operation',
                    "it": 'operazione',
                    "pt-BR": 'operacao',
                    "ru": 'операция'
                })
                .setDescription("Force an operation")
                .setDescriptionLocalizations({
                    "de": 'eine Operation erzwingen',
                    "es-ES": 'Forzar una operación',
                    "fr": 'Forcer une opération',
                    "it": 'forzare un\'operazione',
                    "pt-BR": 'Forçar uma operação',
                    "ru": 'форсировать операцию'
                })
                .addChoices(
                    { name: 'Encode', value: '0' },
                    { name: 'Decode', value: '1' }
                )),
    async execute(client, user, interaction) {

        let aviso = ""

        const codificar = {
            texto: interaction.options.getString("text"),
            reverso: interaction.options.getString("reverse"),
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
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
            .catch(() => client.tls.reply(interaction, user, "util.binario.error_1", true, client.emoji(0)))
    }
}