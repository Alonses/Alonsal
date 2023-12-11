const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("support")
        .setNameLocalizations({
            "de": 'unterstützung',
            "es-ES": 'soporte',
            "fr": 'soutien',
            "it": 'supporto',
            "pt-BR": 'suporte',
            "ru": 'поддержка'
        })
        .setDescription("⌠📡⌡ Support Alon")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Unterstützen Sie Alon',
            "es-ES": '⌠📡⌡ Apoya a Alon',
            "fr": '⌠📡⌡ Soutenez Alon',
            "it": '⌠📡⌡ Supporta Alon',
            "pt-BR": '⌠📡⌡ Dê suporte ao Alon',
            "ru": '⌠📡⌡ Поддержите Alon™️'
        }),
    async execute({ client, user, interaction }) {

        const row = client.create_buttons([
            { name: client.tls.phrase(user, "manu.apoio.contribua"), type: 4, emoji: client.emoji("mc_bolo"), value: "https://picpay.me/slondo" },
            { name: "Buy a Coffee!", type: 4, emoji: "☕", value: "https://www.buymeacoffee.com/slondo" }
        ], interaction)

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "manu.apoio.apoie")} ${client.emoji("mc_bolo")}`)
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/VCneT1l.png")
            .setDescription(client.tls.phrase(user, "manu.apoio.escaneie"))

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    }
}