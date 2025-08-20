const { SlashCommandBuilder } = require('discord.js')

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
            { name: { tls: "manu.hub.conectar" }, value: process.env.url_support, type: 4, emoji: client.emoji("icon_rules_channel") }
        ], interaction, user)

        const embed = client.create_embed({
            title: `${client.tls.phrase(user, "manu.hub.hub_alonsal")} ${client.emoji("dancando_elizabeth")}`,
            image: "https://i.imgur.com/N8AFVTH.png",
            description: { tls: "manu.hub.info" },
        }, user)

        interaction.reply({
            embeds: [embed],
            components: [row],
            flags: "Ephemeral"
        })
    }
}