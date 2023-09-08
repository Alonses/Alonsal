const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("translate")
        .setNameLocalizations({
            "de": 'übersetzen',
            "es-ES": 'traducir',
            "fr": 'traduire',
            "it": 'tradurre',
            "pt-BR": 'traduz',
            "ru": 'перевести'
        })
        .setDescription("⌠📡⌡ Help improve translations or implement new languages!")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Helfen Sie mit, Übersetzungen zu verbessern oder neue Sprachen zu implementieren!',
            "es-ES": '⌠📡⌡ ¡Ayude a mejorar las traducciones o implemente nuevos idiomas!',
            "fr": '⌠📡⌡ Aidez à améliorer les traductions ou implémentez de nouvelles langues!',
            "it": '⌠📡⌡ Aiutaci a migliorare le traduzioni o implementare nuove lingue!',
            "pt-BR": '⌠📡⌡ Ajude a melhorar traduções ou implementar novos idiomas!',
            "ru": '⌠📡⌡ Помогите улучшить перевод или ввести новые языки!'
        }),
    async execute(client, user, interaction) {

        const row = client.create_buttons([
            { name: "GitHub", type: 4, emoji: "🌐", value: "https://github.com/Alonses/Alondioma" }
        ])

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "manu.traduz.titulo")} ${client.emoji("dancando")}`)
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/zSVqxhV.png")
            .setDescription(client.tls.phrase(user, "manu.traduz.descricao"))

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    }
}