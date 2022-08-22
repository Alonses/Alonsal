const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const fs = require('fs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('games')
        .setDescription('⌠💂⌡ Anúncio de games free')
        .addSubcommand(subcommand =>
			subcommand
                .setName('notifica')
                .setDescription('⌠💂⌡ (Des)Habilitar anúncio de games free')
                .addRoleOption(option =>
                    option.setName('cargo')
                        .setDescription('O cargo que será notificado'))
                .addChannelOption(option =>
                    option.setName('canal')
                        .setDescription('O canal que será usado')))
        .addSubcommand(subcommand =>
			subcommand
				.setName('agora')
				.setDescription('⌠💡⌡ O(s) jogo(s) gratuito(s) do momento')),
	async execute(client, interaction) {
        
		const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const { canal_games } = require('../../arquivos/data/games/canal_games.json')
        
        if(interaction.options.getSubcommand() === "agora"){

            interaction.deferReply()
            
            fetch('https://apisal.herokuapp.com/games')
            .then(response => response.json())
            .then(async res => {

                const row = new ActionRowBuilder()
                let jogos_disponiveis = []

                res.forEach(valor => {

                    let nome_jogo = valor.nome.length > 10 ? `${valor.nome.slice(0, 9)}...` : valor.nome;

                    jogos_disponiveis.push(`- ${valor.nome} [ ${moderacao[6]["ate_data"]} ${valor.data_final} ]`)

                    row.addComponents(
                        new ButtonBuilder()
                        .setLabel(nome_jogo)
                        .setURL(valor.link)
                        .setStyle(ButtonStyle.Link),
                    )
                })

                const embed = new EmbedBuilder()
                .setTitle(moderacao[6]["ativos"])
                .setThumbnail(res[0].thumbnail)
                .setColor(0x29BB8E)
                .setDescription(`${moderacao[6]["resgate_dica"]}\n\`\`\`${jogos_disponiveis.join("\n")}\`\`\``)

                return interaction.editReply({ embeds: [embed], components: [row]})
            })
        }else{

            let opcao_remove = false

            if(!interaction.member.permissions.has("ADMINISTRATOR") && !client.owners.includes(interaction.user.id)) return interaction.reply(moderacao[5]["moderadores"]) // Libera configuração para proprietários e adms apenas

            let entradas = interaction.options.data[0].options, canal_alvo

            const notificador = {
                cargo: null,
                canal: null
            }
            
            // Coletando todas as entradas
            entradas.forEach(valor => {

                if(valor.name == "cargo")
                    notificador.cargo = valor.value

                if(valor.name == "canal"){
                    notificador.canal = valor.value

                    if(valor.channel.type !== 0 && valor.channel.type !== 5) // Canal inválido
                        return interaction.reply({ content: `:octagonal_sign: | ${moderacao[6]["tipo_canal"]}`, ephemeral: true })
                }
            })

            if(!notificador.canal || !notificador.cargo)
                opcao_remove = "rem"
            
            const outputArray = [] // Transfere todos os dados do JSON para um array
            for(const element in canal_games){

                const canal = canal_games[element][0]
                const cargo = canal_games[element][1]
                
                if(opcao_remove !== "rem" || element !== interaction.guild.id){ // Remove um servidor/canal da lista de clientes no json
                    outputArray.push(
                        constructJson(element, [canal, cargo])
                    )
                }
            }

            for (let i = 0; i < outputArray.length; i++) { // Procura pelo ID do server e altera o idioma
                const obj = outputArray[i]
                const key = Object.keys(canal_games)

                if(key[i] === interaction.guild.id && opcao_remove !== "rem") {
                    obj[interaction.guild.id][0] = notificador.canal
                    obj[interaction.guild.id][1] = notificador.cargo
                    break
                }
            }
            
            if(opcao_remove !== "rem") // Registra o servidor caso o mesmo não esteja registrado
                outputArray.push(constructJson(interaction.guild.id, [notificador.canal, notificador.cargo]))

            let canal_servidor = JSON.stringify(outputArray, null, 4)
            canal_servidor = canal_servidor.replace("[", "")
            canal_servidor = canal_servidor.slice(0, -1)

            canal_servidor = canal_servidor.replaceAll("{", "").replaceAll("}", "")
            canal_servidor = `{ \"canal_games\" : { ${canal_servidor} } }`

            canal_servidor = JSON.parse(canal_servidor) // Ajusta o arquivo
            canal_servidor = JSON.stringify(canal_servidor, null, 4)
            
            fs.writeFile('./arquivos/data/games/canal_games.json', canal_servidor, (err) => {
                if (err) throw err
                
                let mensagem = `:video_game: | O Servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) agora recebe atts de jogos grátis`

                if(opcao_remove === "rem")
                    mensagem = `:video_game: | O Servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) não recebe mais atts de jogos grátis`

                client.channels.cache.get('872865396200452127').send(mensagem)
            })

            delete require.cache[require.resolve('../../arquivos/data/games/canal_games.json')]
            
            let feedback_user = moderacao[6]["anuncio_games"]

            if(opcao_remove === "rem")
                feedback_user = `:mobile_phone_off: | ${moderacao[6]["anuncio_off"]}`

            interaction.reply({content: feedback_user.replace("repl_canal", `<#${notificador.canal}>`), ephemeral: true })
        }
    }
}

function constructJson(jsonGuild, arrayValores){
	return { [jsonGuild] : arrayValores } 
}