const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const morse = require('../../arquivos/json/text/morse.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('morse')
		.setDescription('⌠💡⌡ (De)codifique do/para o morse')
        .addStringOption(option =>
            option.setName('texto')
                .setDescription('Escreva algo!')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('reverso')
                .setDescription('Inverter resultado de saída'))
        .addStringOption(option =>
            option.setName('operacao')
            .setDescription("Forçar uma operação")
            .addChoices(
                { name: 'Codificar', value: '0' },
                { name: 'Decodificar', value: '1' }
            )),
	async execute(client, interaction) {

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

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