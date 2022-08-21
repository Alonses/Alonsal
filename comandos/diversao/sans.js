const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sans')
		.setDescription('⌠😂⌡ EsCrEvA DeSsA FoRmA RaPidÃo')
		.addStringOption(option =>
            option.setName('texto')
                .setDescription('Insira um texto')
                .setRequired(true)),
	async execute(client, interaction) {
        
		const texto_entrada = (interaction.options.data[0].value).split("")

        for (let i = 0; i < texto_entrada.length; i++)
            if (i % 2 === 0 && i % 1 === 0)
                texto_entrada[i] = texto_entrada[i].toLocaleUpperCase()
            else
                texto_entrada[i] = texto_entrada[i].toLocaleLowerCase()

        interaction.reply(`\`\`\`${texto_entrada.join("").slice(0, 1990)}\`\`\``)
	},
}