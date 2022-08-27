const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const binario = require('../../arquivos/json/text/binario.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('binario')
		.setDescription('⌠💡⌡ (De)codifique do/para o binário')
        .addStringOption(option =>
            option.setName('texto')
                .setDescription('Escreva algo!')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('reverso')
                .setDescription('Inverter resultado de saída'))
        .addStringOption(option =>
            option.setName('operacao')
            .setDescription("Forçar operação")
            .addChoices(
                { name: 'Codificar', value: '0' },
                { name: 'Decodificar', value: '1' }
            )),
	async execute(client, interaction) {

        const {utilitarios} = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        let entradas = interaction.options.data, aviso = ""

        const codificar = {
            texto: null,
            reverso: 0,
            opera: 0
        }

        entradas.forEach(valor => {
            if (valor.name == "texto")
                codificar.texto = valor.value

            if (valor.name == "reverso")
                codificar.reverso = valor.value

            if (valor.name == "operacao")
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
        if (texto_ordenado.replaceAll("\x00", "").length < 1){
            texto_ordenado = utilitarios[3]["resul_vazio"]
            titulo = utilitarios[3]["titulo_vazio"]
        }

        const embed = new EmbedBuilder()
            .setTitle(titulo)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({dynamic: true}) })
            .setColor(0x29BB8E)
            .setDescription(`\`\`\`${texto_ordenado}\`\`\``)
            
            if (aviso.length > 0)
                embed.setFooter({ text: aviso })

        interaction.reply({embeds: [embed], ephemeral: true })
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
    return str.split(" ").map(function(elem) {
        return Object.keys(binario).find(key => binario[key] === elem)
    }).join("")
}