const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setNameLocalizations({
            "pt-BR": 'avalie',
            "es-ES": 'evaluar',
            "fr": 'evaluer',
            "it": 'valutare'
        })
        .setDescription('⌠📡⌡ Rate me!')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Me avalie!',
            "es-ES": '⌠📡⌡ Calificame!',
            "fr": '⌠📡⌡ Notez moi!',
            "it": '⌠📡⌡ Valutami!'
        }),
    async execute(client, user, interaction) {

        const embed = new EmbedBuilder()
            .setColor(client.embed_color(user.misc.color))
            .setTitle(`${client.tls.phrase(user, "manu.avalie.titulo")} ${client.emoji(emojis.dancando)}`)
            .setURL("https://top.gg/bot/833349943539531806")
            .setDescription(client.tls.phrase(user, "manu.avalie.descricao"))
            .setImage("https://i.imgur.com/7Qnd1p7.png")

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}