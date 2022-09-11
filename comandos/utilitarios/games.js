const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))
  
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const create_buttons = require('../../adm/funcoes/create_buttons')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('games')
        .setDescription('⌠💡⌡ O(s) jogo(s) gratuito(s) do momento'),
	async execute(client, interaction) {
        
        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        
        await interaction.deferReply()
        
        fetch('https://apisal.herokuapp.com/games')
        .then(response => response.json())
        .then(async res => {

            let jogos_disponiveis = []
            let objeto_jogos = []
            
            res.forEach(valor => {
                let nome_jogo = valor.nome.length > 20 ? `${valor.nome.slice(0, 20)}...` : valor.nome

                jogos_disponiveis.push(`- ${valor.nome} [ ${moderacao[6]["ate_data"]} ${valor.expira} ]`)
                objeto_jogos.push({ name: nome_jogo, type: 4, value: valor.link})
            })

            // Criando os botões externos para os jogos
            const row = create_buttons(objeto_jogos)

            const embed = new EmbedBuilder()
            .setTitle(moderacao[6]["ativos"])
            .setThumbnail(res[0].thumbnail)
            .setColor(0x29BB8E)
            .setDescription(`${moderacao[6]["resgate_dica"]}\n\`\`\`${jogos_disponiveis.join("\n")}\`\`\``)

            interaction.editReply({ embeds: [embed], components: [row]})
        })
    }
}