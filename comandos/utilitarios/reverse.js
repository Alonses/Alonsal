const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reverse")
        .setDescription("⌠💡⌡ (Un)invert characters!")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ (Des)inverta caracteres!',
            "es-ES": '⌠💡⌡ (Des)invertir caracteres!',
            "fr": '⌠💡⌡ (Dé)inverser les caractères!',
            "it": '⌠💡⌡ (Dis)invertire il testo!',
            "ru": '⌠💡⌡ Перевернуть текст!'
        })
        .addStringOption(option =>
            option.setName("text")
                .setNameLocalizations({
                    "pt-BR": 'texto',
                    "es-ES": 'texto',
                    "fr": 'texte',
                    "it": 'testo',
                    "ru": 'текст'
                })
                .setDescription("The text to be inverted")
                .setDescriptionLocalizations({
                    "pt-BR": 'O texto a ser invertido',
                    "es-ES": 'El texto a invertir',
                    "fr": 'Le texte à revenir',
                    "it": 'Il testo da invertire',
                    "ru": 'Текст, который нужно инвертировать'
                })
                .setRequired(true)),
    async execute(client, user, interaction) {

        const texto_ordenado = interaction.options.data[0].value.split('').reverse().join("")

        const embed = new EmbedBuilder()
            .setTitle(`:arrow_backward: ${client.tls.phrase(user, "util.reverso.reverso")}`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setColor(client.embed_color(user.misc.color))
            .setDescription(`\`${texto_ordenado}\``)

        interaction.reply({ embeds: [embed], ephemeral: user.misc.ghost_mode })
    }
}