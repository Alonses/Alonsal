const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jokenpo')
		.setDescription('⌠🎲⌡ Jogue jokenpô')
        .addStringOption(option =>
            option.setName('escolha')
                .setDescription('Pedra, papel ou tesoura?')),
	async execute(client, interaction) {
        
        const idioma_definido = client.idioma.getLang(interaction)
        const { jogos } = require(`../../arquivos/idiomas/${idioma_definido}.json`)
        
        let jooj = ["pedra", "papel", "tesoura", "pedra"], escolha

        if(idioma_definido === "en-us")
            jooj = ["rock", "paper", "scissors", "rock"]

        if(interaction.options.data.length > 0)
            escolha = (interaction.options.data[0].value).toLowerCase()

        const emojis = [":rock:", ":roll_of_paper:", ":scissors:", ":rock:"]
        let player = Math.round(2 * Math.random())
        
        if(interaction.options.data.length > 0) 
            player = jooj.indexOf(escolha)

        if(player === -1) // Valor não encontrado
            return interaction.reply(jogos[3]["aviso_1"])

        let bot = Math.round(2 * Math.random()), ganhador = ":thumbsdown:"

        if (player === 0) player = 3
        if (bot === 0) bot = 3

        if(player === 3 && bot === 1)
            player = 0
        
        if (bot < player || (player === 1 && bot === 3)) ganhador = ":trophy:"
        if (bot === player) ganhador = ":infinity:"

        let mensagem = `Jokenpô! \n[ ${emojis[bot]} ] Bot\n[ ${emojis[player]} ] <- Você\n[ ${ganhador} ]`

        if(idioma_definido === "en-us")
            mensagem = `Jokenpo! \n[ ${emojis[bot]} ] Bot\n[ ${emojis[player]} ] <- You\n[ ${ganhador} ]`

        return interaction.reply(mensagem)
    }
}