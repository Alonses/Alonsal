const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("support")
        .setNameLocalizations({
            "pt-BR": 'suporte',
            "es-ES": 'soporte',
            "fr": 'soutien',
            "it": 'supporto',
            "ru": 'поддержка'
        })
        .setDescription("⌠📡⌡ Support Alonsal")
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Dê suporte ao Alonsal',
            "es-ES": '⌠📡⌡ Apoya a Alonsal',
            "fr": '⌠📡⌡ Soutenez Alonsal',
            "it": '⌠📡⌡ Supporta Alonsal',
            "ru": '⌠📡⌡ Поддержите Алонсала'
        }),
    async execute(client, user, interaction) {

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "manu.apoio.apoie")} ${client.emoji(emojis.mc_bolo)}`)
            .setColor(client.embed_color(user.misc.color))
            .setURL("https://picpay.me/slondo")
            .setImage("https://i.imgur.com/incYvy2.jpg")
            .setDescription(client.tls.phrase(user, "manu.apoio.escaneie"))

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}