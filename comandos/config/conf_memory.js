const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('c_memory')
		.setDescription('⌠✳️⌡ Veja um resumo de processamento do Alonsal'),
	async execute(client, interaction) {

        const used = process.memoryUsage()
        let text = 'Uso de RAM:\n'

        if (client.idioma.getLang(interaction) === "en-us")
            text = 'RAM usage:\n'

        for (let key in used) 
            text += `${key}: **${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB**\n`

        interaction.reply(text)
    }
}