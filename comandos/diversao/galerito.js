const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

const { gifs } = require("../../arquivos/json/gifs/galerito.json")
const { relation } = require('../../arquivos/songs/galerito/songs.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("galerito")
		.setDescription("⌠😂⌡ Random gifs of rogéria")
		.addSubcommand(subcommand =>
			subcommand
				.setName("gif")
				.setDescription("⌠😂⌡ Random gifs of rogéria")
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ Gifs aleatórios da rogéria',
					"es-ES": '⌠😂⌡ Gifs aleatorios de rogéria',
					"fr": '⌠😂⌡ Gifs aléatoires de rogéria',
					"it": '⌠😂⌡ Gif casuali di rogéria',
					"ru": '⌠😂⌡ Случайные гифки rogéria'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName("fala")
				.setDescription("⌠😂|🇧🇷⌡ Invoca uma fala do galerito"))
		.addSubcommand(subcommand =>
			subcommand
				.setName("menu")
				.setDescription("⌠😂|🇧🇷⌡ Escolha uma fala do galerito")),
	async execute(client, user, interaction) {

		if (interaction.options.getSubcommand() === "gif")
			interaction.reply({
				content: gifs[client.random(gifs)],
				ephemeral: client.decider(user?.conf.ghost_mode, 0)
			})
		else if (interaction.options.getSubcommand() === "fala") {

			const num = client.random(client.countFiles("./arquivos/songs/galerito", "ogg") - 1)

			const file = new AttachmentBuilder(`./arquivos/songs/galerito/galerito_${num}.ogg`, { name: "galerito.ogg" })

			interaction.reply({
				files: [file],
				ephemeral: client.decider(user?.conf.ghost_mode, 0)
			})
		} else {

			const data = {
				alvo: "galerito",
				values: relation
			}

			interaction.reply({
				content: client.tls.phrase(user, "menu.menus.escolher_frase", 6),
				components: [client.create_menus(client, interaction, user, data)],
				ephemeral: client.decider(user?.conf.ghost_mode, 0)
			})
		}
	}
}