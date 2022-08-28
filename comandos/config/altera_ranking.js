const fs = require('fs')
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('c_ranking')
		.setDescription('⌠✳️⌡ Altere o valor do ranking')
        .addNumberOption(option =>
            option.setName('valor')
                .setDescription('O novo valor para o ranking')
                .setRequired(true)),
	async execute(client, interaction) {
        
        if (!client.owners.includes(interaction.user.id)) return
        
        let novo_valor = parseInt(interaction.options.data[0].value)
        const valor_ranking = novo_valor == 0 ? 2 : novo_valor

        fs.readFile('./arquivos/data/ranking/ranking.txt', 'utf8', function(err, data) {
            if (err) throw err
            
            fs.writeFile('./arquivos/data/ranking/ranking.txt', valor_ranking.toString(), (err) => {
                if (err) throw err
            })
        })

        interaction.reply(`:tropical_drink: | Agora o ranking está dando \`${valor_ranking}x\` experiência`)
        client.channels.cache.get('872865396200452127').send(`:medal: | Ranking do Alonsal ajustado para \`${valor_ranking}x\``)
    }
}