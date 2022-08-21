const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('⌠💡⌡ Veja o avatar seu ou de outro usuário.')
		.addUserOption(option => option.setName('alvo').setDescription('Marque outro usuário como alvo')),
	async execute(client, interaction) {
		
		const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
		
		let user = interaction.options.getUser('alvo')
		if (!user) 
			user = interaction.user

		let url_avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=512`
		const download_icon = utilitarios[4]["download_avatar"].replace("link_repl", url_avatar)

		fetch(url_avatar)
		.then(res => {
			if(res.status !== 200)
				url_avatar = url_avatar.replace('.gif', '.webp')

			const embed = new EmbedBuilder()
			.setTitle(`${user.username}`)
			.setDescription(download_icon)
			.setColor(0x29BB8E)
			.setImage(url_avatar)
			
			return interaction.reply({ embeds: [embed] })
		})
		.catch(() => {
			interaction.reply({ text: "Não foi possível buscar este avatar no momento, tente novamente mais tarde"})
		})
	},
}