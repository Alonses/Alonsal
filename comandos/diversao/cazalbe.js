const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

const { gifs } = require('../../arquivos/json/gifs/cazalbe.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("cazalbe")
		.setDescription("⌠😂⌡ Cazalbe King of Prasody")
		.addSubcommand(subcommand =>
			subcommand
				.setName("gif")
				.setDescription("⌠😂⌡ Summons a gif of cazalbe")
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ Invoca um gif do cazalbe',
					"es-ES": '⌠😂⌡ Invoca un gif de cazalbe',
					"fr": '⌠😂⌡ Invoque un gif de cazalbe',
					"it": '⌠😂⌡ Evoca una gif di cazalbe',
					"ru": '⌠😂⌡ отправить cazalbe gif'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName("laugh")
				.setNameLocalizations({
					"pt-BR": 'risada',
					"es-ES": 'risa',
					"fr": 'rire',
					"it": 'risata',
					"ru": 'смех'
				})
				.setDescription("⌠😂⌡ The cazalbe laugh")
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ A risada do cazalbe',
					"es-ES": '⌠😂⌡ La risa del cazalbe',
					"fr": '⌠😂⌡ Le rire cazalbe',
					"it": '⌠😂⌡ La risata di Cazalbe',
					"ru": '⌠😂⌡ Cazalbe cмех'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName("piada")
				.setDescription("⌠😂|🇧🇷⌡ Conta uma piada")),
	async execute(client, user, interaction) {

		if (interaction.options.getSubcommand() === "gif")
			interaction.reply({
				content: gifs[client.random(gifs)],
				ephemeral: client.decider(user?.conf.ghost_mode, 0)
			})
		else if (interaction.options.getSubcommand() === "laugh") {
			const file = new AttachmentBuilder("./arquivos/songs/cazalbe.ogg")
			interaction.reply({
				files: [file],
				ephemeral: client.decider(user?.conf.ghost_mode, 0)
			})
		} else
			require('../../adm/formatadores/chunks/model_charada')(client, user, interaction)
	}
}