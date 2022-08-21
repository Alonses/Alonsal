const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const busca_emoji = require('../../adm/funcoes/busca_emoji')
const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suporte')
		.setDescription('⌠📡⌡ Dê suporte ao Alonsal'),
	async execute(client, interaction) {

        const { manutencao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        const bolo = busca_emoji(client, emojis.mc_bolo)

        const embed = new EmbedBuilder()
        .setColor(0x29BB8E)
        .setTitle(`${manutencao[5]["apoie"]} ${bolo}`)
        .setURL("https://picpay.me/slondo")
        .setDescription(manutencao[5]["escaneie"])
        .setImage("https://i.imgur.com/incYvy2.jpg")
        
        interaction.reply({embeds: [embed], ephemeral: true})
    }
}