const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reverse')
        .setDescription('⌠💡⌡ (Un)invert characters!')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ (Des)inverta caracteres!',
            "es-ES": '⌠💡⌡ (Des)invertir caracteres!',
            "fr": '⌠💡⌡ (Dé)inverser les caractères !'
        })
        .addStringOption(option =>
            option.setName('text')
                .setNameLocalizations({
                    "pt-BR": 'texto',
                    "es-ES": 'texto',
                    "fr": 'texte'
                })
                .setDescription('The text to be inverted')
                .setDescriptionLocalizations({
                    "pt-BR": 'O texto a ser invertido',
                    "es-ES": 'El texto a invertir',
                    "fr": 'Le texte à revenir'
                })
                .setRequired(true)),
    async execute(client, interaction) {

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.usuarios.getUser(interaction.user.id)

        const texto_ordenado = interaction.options.data[0].value.split('').reverse().join("")

        const embed = new EmbedBuilder()
            .setTitle(`:arrow_backward: ${utilitarios[5]["reverso"]}`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setColor(user.misc.embed)
            .setDescription(`\`${texto_ordenado}\``)

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}