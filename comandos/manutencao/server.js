const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const busca_emoji = require('../../adm/discord/busca_emoji')
const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('discord')
        .setDescription('⌠📡⌡ Official Alonsal™️ Server')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Servidor oficial do Alonsal™️',
            "es-ES": '⌠📡⌡ Servidor Oficial Alonsal™️',
            "fr": '⌠📡⌡ Serveur officiel Alonsal™️',
            "it": '⌠📡⌡ Server ufficiale Alonsal™️'
        }),
    async execute(client, interaction) {

        const emoji_rainha = busca_emoji(client, emojis.dancando_elizabeth)
        const user = client.usuarios.getUser(interaction.user.id)

        const embed = new EmbedBuilder()
            .setColor(user.misc.embed)
            .setTitle(`${client.tls.phrase(client, interaction, "manu.hub.hub_alonsal")} ${emoji_rainha}`)
            .setURL('https://discord.gg/ZxHnxQDNwn')
            .setImage('https://i.imgur.com/NqmwCA9.png')
            .setDescription(client.tls.phrase(client, interaction, "manu.hub.info"))

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}