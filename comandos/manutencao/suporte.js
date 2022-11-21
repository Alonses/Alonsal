const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')
const { getUser } = require("../../adm/database/schemas/User.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setNameLocalizations({
            "pt-BR": 'suporte',
            "es-ES": 'soporte',
            "fr": 'soutien',
            "it": 'supporto'
        })
        .setDescription('⌠📡⌡ Support Alonsal')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Dê suporte ao Alonsal',
            "es-ES": '⌠📡⌡ Apoya a Alonsal',
            "fr": '⌠📡⌡ Soutenez Alonsal',
            "it": '⌠📡⌡ Supporta Alonsal'
        }),
    async execute(client, interaction) {

        const bolo = client.emoji(emojis.mc_bolo)
        const user = await getUser(interaction.user.id)

        const embed = new EmbedBuilder()
            .setColor(client.embed_color(user.misc.color))
            .setTitle(`${client.tls.phrase(client, interaction, "manu.apoio.apoie")} ${bolo}`)
            .setURL("https://picpay.me/slondo")
            .setDescription(client.tls.phrase(client, interaction, "manu.apoio.escaneie"))
            .setImage("https://i.imgur.com/incYvy2.jpg")

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}