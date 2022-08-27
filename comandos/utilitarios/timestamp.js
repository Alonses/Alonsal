
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const formata_horas = require("../../adm/funcoes/formata_horas")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timestamp')
		.setDescription('⌠💡⌡ Converta uma data para timestamp ou vice-versa')
		.addStringOption(option =>
            option.setName('tempo')
                .setDescription('O Valor a ser convertido')
                .setRequired(true)),
	async execute(client, interaction) {

        let idioma_definido = client.idioma.getLang(interaction)
        idioma_definido = idioma_definido == "al-br" ? "pt-br" : idioma_definido

        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_definido}.json`)

        let timestamp, aviso = "", conversao_invalida = false
        let titulo = utilitarios[19]["timestamp_1"]
        let data = interaction.options.data[0].value, retorno

        let entrada = interaction.options.data[0].value

        if (!entrada.includes("-")){ // De timestamp para data normal
            timestamp = new Date(Number(entrada * 1000))
            titulo = utilitarios[19]["timestamp_2"]
            retorno = entrada
            
            timestamp = `${timestamp.getFullYear()}-${("0"+ (timestamp.getMonth() + 1)).slice(-2)}-${("0"+ timestamp.getDate()).slice(-2)} ${formata_horas(timestamp.getHours(), timestamp.getMinutes(), timestamp.getSeconds())}`

            if ((timestamp instanceof Date && !isNaN(timestamp)) || timestamp.split("-")[0] == "NaN")
                conversao_invalida = true
        } else { // De data normal para timestamp
            timestamp = new Date(data).getTime() / 1000
            retorno = timestamp

            if (isNaN(timestamp))
                conversao_invalida = true
        }
        
        let dica_conversao = `\n\n<t:${retorno}:R> ( \`<t:${retorno}:R>\` )`

        if (conversao_invalida){
            titulo = utilitarios[19]["erro_titulo"]
            aviso = utilitarios[19]["erro_conversao"]
            timestamp = utilitarios[19]["valor_nulo"]
            dica_conversao = ""
        }

        const embed = new EmbedBuilder()
            .setTitle(titulo)
            .setColor(0x29BB8E)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({dynamic: true}) })
            .setDescription(`\`${data}\` -> \`${timestamp}\`${dica_conversao}`)
        
        if (aviso.length > 0)
            embed.setFooter(aviso)

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}