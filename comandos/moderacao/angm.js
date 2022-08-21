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
                        .setDescription('O cargo que será notificado')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('canal')
                        .setDescription('O canal que será usado')
                        .setRequired(true)))
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

            let valida_existencia = false

            if(!interaction.member.permissions.has("ADMINISTRATOR") && !client.owners.includes(interaction.user.id)) return interaction.reply(moderacao[5]["moderadores"]) // Libera configuração para proprietários e adms apenas

            let entradas = interaction.options.data
            let cargo_escolhido, canal_escolhido
            
            entradas.forEach(valor => {
                if(valor.name == "cargo")
                    cargo_escolhido = valor.value

                if(valor.name == "canal"){
                    canal_escolhido = valor.value

                    if(valor.channel.type !== 0) // Canal inválido
                        return interaction.reply({ content: "O canal definido precisa ser um canal de texto, tente novamente", ephemeral: true })
                }
            })

            const outputArray = [] // Transfere todos os dados do JSON para um array
            for(const element in canal_games){

                const canal = canal_games[element][0]
                const cargo = canal_games[element][1]
                
                if(element !== interaction.guild.id){ // Remove um servidor/canal da lista de clientes no json
                    outputArray.push(
                        constructJson(element, [canal, cargo])
                    )
                }else
                    valida_existencia = true
            }

            for (let i = 0; i < outputArray.length; i++) { // Procura pelo ID do server e altera o idioma
                const obj = outputArray[i]

                const key = Object.keys(canal_games)

                if(key[i] === interaction.guild.id) {
                    obj[interaction.guild.id][0] = canal_escolhido
                    obj[interaction.guild.id][1] = cargo_escolhido
                    break
                }
            }
            
            if(!valida_existencia) // Registra o servidor caso o mesmo não esteja registrado
                outputArray.push(constructJson(interaction.guild.id, [canal_escolhido, cargo_escolhido]))

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

                if(valida_existencia)
                    mensagem = `:video_game: | O Servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) não recebe mais atts de jogos grátis`

                // client.channels.cache.get('872865396200452127').send(mensagem)
            })

            delete require.cache[require.resolve('../../arquivos/data/games/canal_games.json')]
            
            let feedback_user = moderacao[6]["anuncio_games"]

            if(valida_existencia)
                feedback_user = `:mobile_phone_off: | ${moderacao[6]["anuncio_off"]}`

            interaction.reply({content: feedback_user, ephemeral: true })
        }
    }
}

function constructJson(jsonGuild, arrayValores){
	return { [jsonGuild] : arrayValores } 
}