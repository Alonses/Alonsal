const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("discord")
        .setDescription("⌠📡⌡ Official Alon™️ Server")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Offizieller Alon™-Server',
            "es-ES": '⌠📡⌡ Servidor Oficial Alon™️',
            "fr": '⌠📡⌡ Serveur officiel Alon™️',
            "it": '⌠📡⌡ Server ufficiale Alon™️',
            "pt-BR": '⌠📡⌡ Servidor oficial do Alon™️',
            "ru": '⌠📡⌡ Официальный сервер Alon™️'
        }),
    async execute({ client, user, interaction }) {

        const row = client.create_buttons([
            { name: client.tls.phrase(user, "manu.hub.conectar"), value: process.env.url_support, type: 4, emoji: client.emoji("icon_rules_channel") }
        ], interaction)

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "manu.hub.hub_alonsal")} ${client.emoji("dancando_elizabeth")}`)
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/N8AFVTH.png")
            .setDescription(client.tls.phrase(user, "manu.hub.info"))

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    }
}