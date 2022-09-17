const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const busca_emoji = require('../../adm/funcoes/busca_emoji')
const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setNameLocalizations({
            "pt-BR": 'suporte',
            "es-ES": 'soporte',
            "fr": 'soutien'
        })
        .setDescription('⌠📡⌡ Support Alonsal')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Dê suporte ao Alonsal',
            "es-ES": '⌠📡⌡ Apoya a Alonsal',
            "fr": '⌠📡⌡ Soutenez Alonsal'
        }),
    async execute(client, interaction) {

        const { manutencao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const bolo = busca_emoji(client, emojis.mc_bolo)
        const user = client.custom.getUser(interaction.user.id)

        const embed = new EmbedBuilder()
            .setColor(user.color)
            .setTitle(`${manutencao[5]["apoie"]} ${bolo}`)
            .setURL("https://picpay.me/slondo")
            .setDescription(manutencao[5]["escaneie"])
            .setImage("https://i.imgur.com/incYvy2.jpg")

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}