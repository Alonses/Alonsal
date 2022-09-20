const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const binario = require('../../arquivos/json/text/binario.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('binary')
        .setNameLocalizations({
            "pt-BR": 'binario',
            "fr": 'binarie'
        })
        .setDescription('⌠💡⌡ (De)code from/to binary')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ (De)codifique do/para o binario',
            "es-ES": '⌠💡⌡ (Des)codificar de/a binario',
            "fr": '⌠💡⌡ (Dé)coder de/vers binaire'
        })
        .addStringOption(option =>
            option.setName('text')
                .setNameLocalizations({
                    "pt-BR": 'texto',
                    "es-ES": 'texto',
                    "fr": 'texte'
                })
                .setDescription('Write something!')
                .setDescriptionLocalizations({
                    "pt-BR": 'Escreva algo!',
                    "es-ES": '¡Escribe algo!',
                    "fr": 'Écris quelque chose!'
                })
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('reverse')
                .setNameLocalizations({
                    "pt-BR": 'reverso',
                    "es-ES": 'reverso',
                    "fr": 'inverse'
                })
                .setDescription('Invert output result')
                .setDescriptionLocalizations({
                    "pt-BR": 'Inverter resultado de saída',
                    "es-ES": 'Invertir resultado de salida',
                    "fr": 'Inverser le résultat de sortie'
                }))
        .addStringOption(option =>
            option.setName('operation')
                .setNameLocalizations({
                    "pt-BR": 'operacao',
                    "es-ES": 'operacion',
                    "fr": 'operation'
                })
                .setDescription("Force an operation")
                .setDescriptionLocalizations({
                    "pt-BR": 'Forçar uma operação',
                    "es-ES": 'Forzar una operación',
                    "fr": 'Forcer une opération'
                })
                .addChoices(
                    { name: 'Encode', value: '0' },
                    { name: 'Decode', value: '1' }
                )),
    async execute(client, interaction) {

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.usuarios.getUser(interaction.user.id)

        let entradas = interaction.options.data, aviso = ""

        const codificar = {
            texto: null,
            reverso: 0,
            opera: 0
        }

        entradas.forEach(valor => {
            if (valor.name == "text")
                codificar.texto = valor.value

            if (valor.name == "reverse")
                codificar.reverso = valor.value

            if (valor.name == "operation")
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
        let titulo = utilitarios[3]["codificado"]

        if (codificar.opera)
            titulo = utilitarios[3]["decodificado"]

        // Confirma que a operação não resultou em uma string vazia
        if (texto_ordenado.replaceAll("\x00", "").length < 1) {
            texto_ordenado = utilitarios[3]["resul_vazio"]
            titulo = utilitarios[3]["titulo_vazio"]
        }

        const embed = new EmbedBuilder()
            .setTitle(titulo)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setColor(user.color)
            .setDescription(`\`\`\`${texto_ordenado}\`\`\``)

        if (aviso.length > 0)
            embed.setFooter({ text: aviso })

        interaction.reply({ embeds: [embed], ephemeral: true })
            .catch(() => {
                interaction.reply({ content: `:octagonal_sign: | ${utilitarios[3]["error_1"]}`, ephemeral: true })
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