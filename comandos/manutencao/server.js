const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("discord")
        .setDescription("⌠📡⌡ Official Alonsal™️ Server")
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Servidor oficial do Alonsal™️',
            "es-ES": '⌠📡⌡ Servidor Oficial Alonsal™️',
            "fr": '⌠📡⌡ Serveur officiel Alonsal™️',
            "it": '⌠📡⌡ Server ufficiale Alonsal™️',
            "ru": '⌠📡⌡ Официальный сервер Алонсал™'
        }),
    async execute(client, user, interaction) {

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "manu.hub.hub_alonsal")} ${client.emoji(emojis.dancando_elizabeth)}`)
            .setURL("https://discord.gg/ZxHnxQDNwn")
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/NqmwCA9.png")
            .setDescription(client.tls.phrase(user, "manu.hub.info"))

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}