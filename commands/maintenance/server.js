const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("discord")
        .setDescription("⌠📡⌡ Official Alonsal™️ Server")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Offizieller Alonsal™-Server',
            "es-ES": '⌠📡⌡ Servidor Oficial Alonsal™️',
            "fr": '⌠📡⌡ Serveur officiel Alonsal™️',
            "it": '⌠📡⌡ Server ufficiale Alonsal™️',
            "pt-BR": '⌠📡⌡ Servidor oficial do Alonsal™️',
            "ru": '⌠📡⌡ Официальный сервер Alonsal™️'
        }),
    async execute({ client, user, interaction }) {

        const row = client.create_buttons([
            { name: { name: "manu.hub.conectar", alvo: user }, value: process.env.url_support, type: 4, emoji: client.emoji("icon_rules_channel") }
        ], interaction)

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "manu.hub.hub_alonsal")} ${client.emoji("dancando_elizabeth")}`)
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/N8AFVTH.png")
            .setDescription(client.tls.phrase(user, "manu.hub.info"))

        interaction.reply({
            embeds: [embed],
            components: [row],
            flags: "Ephemeral"
        })
    }
}