
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const formata_horas = require("../../adm/funcoes/formata_horas")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timestamp')
		.setDescription('⌠💡⌡ Converta uma data para timestamp ou vice-versa')
        .addSubcommand(subcommand =>
            subcommand
                .setName('custom')
                .setDescription('⌠💡⌡ Timestamp customizado')
                .addStringOption(option =>
                    option.setName("tempo")
                    .setDescription("O Valor a ser convertido"))
                .addStringOption(option =>
                    option.setName('timer')
                    .setDescription('Uma data rápida para marcar')
                    .addChoices(
                        { name: '+5 Minutos', value: '5' },
                        { name: '+10 Minutos', value: '10' },
                        { name: '+30 Minutos', value: '30' },
                        { name: '+1 Hora', value: '60' },
                        { name: '+2 Horas', value: '120' }
                    )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('agora')
                .setDescription('⌠💡⌡ Timestamp atual')),
	async execute(client, interaction) {
        
        let idioma_definido = client.idioma.getLang(interaction)
        idioma_definido = idioma_definido == "al-br" ? "pt-br" : idioma_definido

        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_definido}.json`)

        let timestamp, aviso = "", conversao_invalida = false
        let titulo = utilitarios[19]["timestamp_1"]
        let data = interaction.options.data[0].value, retorno, entrada = null, timer = 0
        let conversao_valida = ""

        if (interaction.options.getSubcommand() !== "agora"){ // Entrada customizada
            let opcoes = interaction.options.data[0].options

            opcoes.forEach(valor => {

                if (valor.name == "tempo")
                    entrada = parseInt(valor.value)

                if (valor.name == "timer")
                    timer = parseInt(valor.value) * 60
            })

            if (!entrada)
                entrada = Math.floor(Date.now() / 1000) + timer // Iniciando o timestamp 

            if (!isNaN(entrada)) {
                titulo = utilitarios[19]["timestamp_crono"]
                retorno = entrada

                timestamp = new Date(entrada)
                timestamp = `${timestamp.getFullYear()}-${("0"+ (timestamp.getMonth() + 1)).slice(-2)}-${("0"+ timestamp.getDate()).slice(-2)} ${formata_horas(timestamp.getHours(), timestamp.getMinutes(), timestamp.getSeconds())}`

                conversao_invalida = false
            } else if (!entrada.includes("-")) { // De timestamp para data normal
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

            if(conversao_invalida)
                conversao_valida = `\`${data}\` -> \`${timestamp}\``
        } else {
            retorno = Math.floor(Date.now() / 1000)
            titulo = utilitarios[19]["timestamp_now"]
        }
        
        let dica_conversao = `\n\n( \`<t:${retorno}:R>\` ) <t:${retorno}:R>\n( \`<t:${retorno}:t>\` ) <t:${retorno}:t>\n( \`<t:${retorno}:T>\` ) <t:${retorno}:T>\n( \`<t:${retorno}:d>\` ) <t:${retorno}:d>\n( \`<t:${retorno}:D>\` ) <t:${retorno}:D>\n( \`<t:${retorno}:f>\` ) <t:${retorno}:f>\n( \`<t:${retorno}:F>\` ) <t:${retorno}:F>`

        if (conversao_invalida) {
            titulo = utilitarios[19]["erro_titulo"]
            aviso = utilitarios[19]["erro_conversao"]
            timestamp = utilitarios[19]["valor_nulo"]
            dica_conversao = ""
        }

        const embed = new EmbedBuilder()
            .setTitle(titulo)
            .setColor(0x29BB8E)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({dynamic: true}) })
            .setDescription(`${conversao_valida}${dica_conversao}`)
        
        if (aviso.length > 0)
            embed.setFooter(aviso)

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}