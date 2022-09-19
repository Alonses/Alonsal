const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const morse = require('../../arquivos/json/text/morse.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('morse')
        .setDescription('⌠💡⌡ (De)code from/to morse')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ (De)codifique do/para o morse',
            "es-ES": '⌠💡⌡ (Des)codificar de/a morse',
            "fr": '⌠💡⌡ (Dé)coder de/vers morse'
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

        // Entradas traduzíveis
        const ent_texto = ["texto", "texte", "text"], ent_reverso = ["reverso", "reverse", "inverse"], ent_operacao = ["operacao", "operation"]

        entradas.forEach(valor => {
            if (ent_texto.includes(valor.name))
                codificar.texto = valor.value

            if (ent_reverso.includes(valor.name))
                codificar.reverso = valor.value

            if (ent_operacao.includes(valor.name))
                codificar.opera = parseInt(valor.value)
        })

        if (!codificar.opera) { // Codificando
            texto = codificar.texto.split('')

            for (let carac = 0; carac < texto.length; carac++) {
                if (morse[texto[carac]])
                    texto[carac] = `${morse[texto[carac]]} `
                else {
                    texto[carac] = ""
                    aviso = utilitarios[2]["caracteres"]
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
        let titulo = utilitarios[2]["codificado"]

        if (codificar.opera)
            titulo = utilitarios[2]["decodificado"]

        if (texto_ordenado.length === 0) {
            texto_ordenado = utilitarios[2]["carac_invalidos"]
            titulo = utilitarios[2]["error"]
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