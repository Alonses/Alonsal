const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reverse')
		.setDescription('⌠💡⌡ (Un)invert characters!')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ (Des)inverta caracteres!',
            "fr": '⌠💡⌡ (Dé)inverser les caractères !'
        })
		.addStringOption(option =>
            option.setName('text')
                .setNameLocalizations({
                    "pt-BR": 'texto',
                    "fr": 'texte'
                })
                .setDescription('The text to be inverted')
                .setDescriptionLocalizations({
                    "pt-BR": 'O texto a ser invertido',
                    "fr": 'Le texte à revenir'
                })
                .setRequired(true)),
	async execute(client, interaction) {

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        const ordena = interaction.options.data[0].value

        let texto = ordena.split('')
        texto = texto.reverse()

        const texto_ordenado = texto.join("")

        const embed = new EmbedBuilder()
            .setTitle(`:arrow_backward: ${utilitarios[5]["reverso"]}`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic:true }) })
            .setColor(0x29BB8E)
            .setDescription(`\`${texto_ordenado}\``)

        interaction.reply({ embeds: [embed] })
    }
}