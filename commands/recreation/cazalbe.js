const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

const { gifs } = require('../../files/json/gifs/cazalbe.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("cazalbe")
		.setDescription("⌠😂⌡ Cazalbe King of Prasody")
		.addSubcommand(subcommand =>
			subcommand
				.setName("gif")
				.setDescription("⌠😂⌡ Summons a gif of cazalbe")
				.setDescriptionLocalizations({
					"de": '⌠😂⌡ Beschwört ein Cazalbe-GIF',
					"es-ES": '⌠😂⌡ Invoca un gif de cazalbe',
					"fr": '⌠😂⌡ Invoque un gif de cazalbe',
					"it": '⌠😂⌡ Evoca una gif di cazalbe',
					"pt-BR": '⌠😂⌡ Invoca um gif do cazalbe',
					"ru": '⌠😂⌡ отправить cazalbe gif'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName("laugh")
				.setNameLocalizations({
					"de": 'lachen',
					"es-ES": 'risa',
					"fr": 'rire',
					"it": 'risata',
					"pt-BR": 'risada',
					"ru": 'смех'
				})
				.setDescription("⌠😂⌡ The cazalbe laugh")
				.setDescriptionLocalizations({
					"de": '⌠😂⌡ Cazalbes Lachen',
					"es-ES": '⌠😂⌡ La risa del cazalbe',
					"fr": '⌠😂⌡ Le rire cazalbe',
					"it": '⌠😂⌡ La risata di Cazalbe',
					"pt-BR": '⌠😂⌡ A risada do cazalbe',
					"ru": '⌠😂⌡ Cazalbe cмех'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName("piada")
				.setDescription("⌠😂|🇧🇷⌡ Conta uma piada")),
	async execute({ client, user, interaction }) {

		if (interaction.options.getSubcommand() === "gif")
			interaction.reply({
				content: gifs[client.random(gifs)],
				ephemeral: client.decider(user?.conf.ghost_mode, 0)
			})
		else if (interaction.options.getSubcommand() === "laugh") {
			const file = new AttachmentBuilder("./files/songs/cazalbe.ogg")
			interaction.reply({
				files: [file],
				ephemeral: client.decider(user?.conf.ghost_mode, 0)
			})
		} else
			require('../../core/formatters/chunks/model_charada')(client, user, interaction)
	}
}