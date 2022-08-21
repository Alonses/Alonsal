const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const busca_emoji = require('../../adm/funcoes/busca_emoji')
const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('⌠📡⌡ Servidor oficial do Alonsal™️'),
	async execute(client, interaction) {

        const { manutencao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const emoji_rainha = busca_emoji(client, emojis.dancando_elizabeth)

        const embed = new EmbedBuilder()
        .setColor(0x29BB8E)
        .setTitle(`${manutencao[6]["hub_alonsal"]} ${emoji_rainha}`)
        .setURL('https://discord.gg/ZxHnxQDNwn')
        .setImage('https://i.imgur.com/NqmwCA9.png')
        .setDescription(manutencao[6]["info"])

        interaction.reply({embeds: [embed], ephemeral: true})
    }
}