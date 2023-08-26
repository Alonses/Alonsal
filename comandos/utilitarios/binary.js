const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const binario = require('../../arquivos/json/text/binario.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("binary")
        .setNameLocalizations({
            "de": 'binär',
            "es-ES": 'binario',
            "fr": 'binarie',
            "it": 'binario',
            "pt-BR": 'binario',
            "ru": 'бинарный'
        })
        .setDescription("⌠💡⌡ (De)code from/to binary")
        .setDescriptionLocalizations({
            "de": '⌠💡⌡ Binärübersetzer',
            "es-ES": '⌠💡⌡ (Des)codificar de/a binario',
            "fr": '⌠💡⌡ (Dé)coder de/vers binaire',
            "it": '⌠💡⌡ (Da) codice da/per binario',
            "pt-BR": '⌠💡⌡ (De)codifique do/para o binario',
            "ru": '⌠💡⌡ (де)код из/в двоичный код'
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

function textToBinary(str) {
    return str.split('').map(char => {
        return binario[char]
    }).join(' ')
}

function binaryToText(str) {
    return str.split(" ").map(function (elem) {
        return Object.keys(binario).find(key => binario[key] === elem)
    }).join("")
}