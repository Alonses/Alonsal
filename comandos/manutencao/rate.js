const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rate")
        .setNameLocalizations({
            "pt-BR": 'avaliar',
            "es-ES": 'evaluar',
            "fr": 'evaluer',
            "it": 'valutare',
            "ru": 'oценивать'
        })
        .setDescription("⌠📡⌡ Rate me!")
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Me avalie!',
            "es-ES": '⌠📡⌡ Calificame!',
            "fr": '⌠📡⌡ Notez moi!',
            "it": '⌠📡⌡ Valutami!',
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