const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { existsSync } = require('fs')

const busca_badges = require('../../adm/funcoes/busca_badges.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('badges')
		.setDescription('⌠😂⌡ Veja e fixe suas badges!')
        .addStringOption(option =>
            option.setName('fixar')
                .setDescription('Qual vai fixar?')),
	async execute(client, interaction) {

        // Procurando pelas badges antes do comando
        if (!existsSync(`./arquivos/data/badges/${interaction.user.id}/badges.json`))
            interaction.reply({ content: "Você não possui nenhuma badge para visualizar!", ephemeral: true })
        
        if (!interaction.options.data[0]) {

            const embed = new EmbedBuilder()
            .setTitle("> Suas Badges")
            .setColor(0x29BB8E)
            .setDescription(busca_badges(client, 'all', interaction.user.id))
            .setFooter({ text: 'Use o comando /badges fixar:<nome> para fixar uma!'})

            interaction.reply({ embeds: [embed], ephemeral: true })
        } else
            interaction.reply({ content: 'Um comando bem enceirado vem por aí...', ephemeral: true })
    }
}