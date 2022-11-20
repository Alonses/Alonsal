const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const binario = require('../../arquivos/json/text/binario.json')
const { getUser } = require("../../adm/database/schemas/User.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('binary')
        .setNameLocalizations({
            "pt-BR": 'binario',
            "es-ES": 'binario',
            "fr": 'binarie',
            "it": 'binario'
        })
        .setDescription('⌠💡⌡ (De)code from/to binary')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ (De)codifique do/para o binario',
            "es-ES": '⌠💡⌡ (Des)codificar de/a binario',
            "fr": '⌠💡⌡ (Dé)coder de/vers binaire',
            "it": '⌠💡⌡ (Da) codice da/per binario'
        })
        .addStringOption(option =>
            option.setName('text')
                .setNameLocalizations({
                    "pt-BR": 'texto',
                    "es-ES": 'texto',
                    "fr": 'texte',
                    "it": 'testo'
                })
                .setDescription('Write something!')
                .setDescriptionLocalizations({
                    "pt-BR": 'Escreva algo!',
                    "es-ES": '¡Escribe algo!',
                    "fr": 'Écris quelque chose!',
                    "it": 'Scrivi qualcosa!'
                })
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('reverse')
                .setNameLocalizations({
                    "pt-BR": 'reverso',
                    "es-ES": 'reverso',
                    "fr": 'inverse',
                    "it": 'inversione'
                })
                .setDescription('Invert output result')
                .setDescriptionLocalizations({
                    "pt-BR": 'Inverter resultado de saída',
                    "es-ES": 'Invertir resultado de salida',
                    "fr": 'Inverser le résultat de sortie',
                    "it": 'invertire il risultato di output'
                }))
        .addStringOption(option =>
            option.setName('operation')
                .setNameLocalizations({
                    "pt-BR": 'operacao',
                    "es-ES": 'operacion',
                    "fr": 'operation',
                    "it": 'operazione'
                })
                .setDescription("Force an operation")
                .setDescriptionLocalizations({
                    "pt-BR": 'Forçar uma operação',
                    "es-ES": 'Forzar una operación',
                    "fr": 'Forcer une opération',
                    "it": 'forzare un\'operazione'
                })
                .addChoices(
                    { name: 'Encode', value: '0' },
                    { name: 'Decode', value: '1' }
                )),
    async execute(client, interaction) {

        const user = await getUser(interaction.user.id)

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

        if (!codificar.opera) // Codificando
            texto = textToBinary(codificar.texto)
        else // Decodificando
            texto = binaryToText(codificar.texto)

        texto = texto.split("")

        if (codificar.reverso) // Inverte os caracteres
            texto = texto.reverse()

        // Montando 
        let texto_ordenado = texto.join("")
        let titulo = client.tls.phrase(client, interaction, "util.binario.codificado")

        if (codificar.opera)
            titulo = client.tls.phrase(client, interaction, "util.binario.decodificado")

        // Confirma que a operação não resultou em uma string vazia
        if (texto_ordenado.replaceAll("\x00", "").length < 1) {
            texto_ordenado = client.tls.phrase(client, interaction, "util.binario.resul_vazio")
            titulo = client.tls.phrase(client, interaction, "util.binario.titulo_vazio")
        }

        const embed = new EmbedBuilder()
            .setTitle(titulo)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setColor(user.misc.embed)
            .setDescription(`\`\`\`${texto_ordenado}\`\`\``)

        if (aviso.length > 0)
            embed.setFooter({ text: aviso })

        interaction.reply({ embeds: [embed], ephemeral: true })
            .catch(() => {
                client.tls.reply(client, interaction, "util.binario.error_1", true, 0)
            })
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