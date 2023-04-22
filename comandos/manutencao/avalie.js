const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rate")
        .setNameLocalizations({
            "pt-BR": 'avalie',
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

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "manu.avalie.titulo")} ${client.emoji(emojis.dancando)}`)
            .setColor(client.embed_color(user.misc.color))
            .setURL("https://top.gg/bot/833349943539531806")
            .setImage("https://i.imgur.com/7Qnd1p7.png")
            .setDescription(client.tls.phrase(user, "manu.avalie.descricao"))

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}