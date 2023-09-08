const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("review")
        .setNameLocalizations({
            "de": 'analyse',
            "es-ES": 'analisis',
            "fr": 'analyse',
            "it": 'analisi',
            "pt-BR": 'avaliar',
            "ru": 'анализ'
        })
        .setDescription("⌠📡⌡ Review me!")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Bewerte mich!',
            "es-ES": '⌠📡⌡ Calificame!',
            "fr": '⌠📡⌡ Notez moi!',
            "it": '⌠📡⌡ Valutami!',
            "pt-BR": '⌠📡⌡ Me avalie!',
            "ru": '⌠📡⌡ Оцените меня!'
        }),
    async execute(client, user, interaction) {

        const row = client.create_buttons([
            { name: client.tls.phrase(user, "manu.avalie.avaliar"), type: 4, emoji: client.emoji("emojis_dancantes"), value: "https://top.gg/bot/833349943539531806" },
            { name: client.tls.phrase(user, "inic.inicio.convidar"), type: 4, emoji: client.emoji("mc_coracao"), value: `https://discord.com/oauth2/authorize?client_id=${client.id()}&scope=bot&permissions=1614150720` }
        ], interaction)

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "manu.avalie.titulo")} ${client.emoji("emojis_dancantes")}`)
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/7Qnd1p7.png")
            .setDescription(client.tls.phrase(user, "manu.avalie.descricao"))

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    }
}