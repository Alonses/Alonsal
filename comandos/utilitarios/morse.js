const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const morse = require('../../arquivos/json/text/morse.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("morse")
        .setDescription("⌠💡⌡ (De)code from/to morse")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ (De)codifique do/para o morse',
            "es-ES": '⌠💡⌡ (Des)codificar de/a morse',
            "fr": '⌠💡⌡ (Dé)coder de/vers morse',
            "it": '⌠💡⌡ (Da) codice da/per morse',
            "ru": '⌠💡⌡ (Де)код в/из азбуки Морзе'
        })
        .addStringOption(option =>
            option.setName("text")
                .setNameLocalizations({
                    "pt-BR": 'texto',
                    "es-ES": 'texto',
                    "fr": 'texte',
                    "it": 'testo',
                    "ru": 'текст'
                })
                .setDescription("Write something!")
                .setDescriptionLocalizations({
                    "pt-BR": 'Escreva algo!',
                    "es-ES": '¡Escribe algo!',
                    "fr": 'Écris quelque chose!',
                    "it": 'Scrivi qualcosa!',
                    "ru": 'Напиши что-нибудь!'
                })
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName("reverse")
                .setNameLocalizations({
                    "pt-BR": 'reverso',
                    "es-ES": 'reverso',
                    "fr": 'inverse',
                    "it": 'inversione'
                })
                .setDescription("Invert output result")
                .setDescriptionLocalizations({
                    "pt-BR": 'Inverter resultado de saída',
                    "es-ES": 'Invertir resultado de salida',
                    "fr": 'Inverser le résultat de sortie',
                    "it": 'invertire il risultato di output',
                    "ru": 'инвертировать вывод'
                }))
        .addStringOption(option =>
            option.setName("operation")
                .setNameLocalizations({
                    "pt-BR": 'operacao',
                    "es-ES": 'operacion',
                    "fr": 'operation',
                    "it": 'operazione',
                    "ru": 'операция'
                })
                .setDescription("Force an operation")
                .setDescriptionLocalizations({
                    "pt-BR": 'Forçar uma operação',
                    "es-ES": 'Forzar una operación',
                    "fr": 'Forcer une opération',
                    "it": 'forzare un\'operazione',
                    "ru": 'форсировать операцию'
                })
                .addChoices(
                    { name: 'Encode', value: '0' },
                    { name: 'Decode', value: '1' }
                )),
    async execute(client, user, interaction) {

        let entradas = interaction.options.data, aviso = ""

        const codificar = {
            texto: null,
            reverso: 0,
            opera: 0
        }

        entradas.forEach(valor => {
            if (valor.name === "text")
                codificar.texto = valor.value

            if (valor.name === "reverse")
                codificar.reverso = valor.value

            if (valor.name === "operation")
                codificar.opera = parseInt(valor.value)
        })

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
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setColor(client.embed_color(user.misc.color))
            .setDescription(`\`\`\`${texto_ordenado}\`\`\``)

        if (aviso.length > 0)
            embed.setFooter({ text: aviso })

        interaction.reply({ embeds: [embed], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
            .catch(() => client.tls.reply(interaction, user, "util.binario.error_1", true, 0))
    }
}