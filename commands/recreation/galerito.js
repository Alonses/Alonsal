const { SlashCommandBuilder } = require('discord.js')

const TYPE_CHOICES = [
	{ name: '🔊 Speaks', value: 'speaks' },
	{ name: '👾 Gif', value: 'gif' },
	{ name: '😇 Peace', value: 'peace' },
	{ name: '🧾 Menu', value: 'menu' }
]

module.exports = {
	data: new SlashCommandBuilder()
		.setName("galerito")
		.setDescription("⌠😂⌡ Rogéria!")
		.addStringOption(option =>
			option.setName("operation")
				.setNameLocalizations({
					"de": 'betrieb',
					"es-ES": 'operacion',
					"fr": 'operation',
					"it": 'operazione',
					"pt-BR": 'operacao',
					"ru": 'операция'
				})
				.setDescription("Select an operation")
				.setDescriptionLocalizations({
					"de": 'Wählen Sie einen Vorgang aus',
					"es-ES": 'Seleccione una operación',
					"fr": 'Sélectionnez une opération',
					"it": 'Seleziona un\'operazione',
					"pt-BR": 'Escolha uma operação',
					"ru": 'Выберите операцию'
				})
				.addChoices(...TYPE_CHOICES)
				.setRequired(true)),
	async execute({ client, user, interaction, user_command }) {

		// Redirecionando o evento
		require(`./subcommands/galerito_${interaction.options.getString("operation")}`)({ client, user, interaction, user_command })
	}
}