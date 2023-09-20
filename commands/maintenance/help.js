const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("⌠🌎⌡ It all starts here")
        .setDescriptionLocalizations({
            "de": '⌠🌎⌡ Hier beginnt alles',
            "es-ES": '⌠🌎⌡ Todo comienza aquí',
            "fr": '⌠🌎⌡ Tout commence ici',
            "it": '⌠🌎⌡ Tutto inizia qui',
            "pt-BR": '⌠🌎⌡ Tudo começa por aqui',
            "ru": '⌠🌎⌡ Все начинается здесь'
        }),
    async execute(client, user, interaction) {

        const row = client.create_buttons([
            { name: client.tls.phrase(user, "inic.ping.site"), type: 4, emoji: "🌐", value: 'http://alonsal.glitch.me/' },
            { name: client.tls.phrase(user, "inic.inicio.suporte"), type: 4, emoji: client.emoji("icon_rules_channel"), value: process.env.url_support },
            { name: client.tls.phrase(user, "manu.avalie.avaliar"), type: 4, emoji: client.emoji("emojis_dancantes"), value: "https://top.gg/bot/833349943539531806" },
            { name: "Alondioma", type: 4, emoji: "🏴‍☠️", value: "https://github.com/Alonses/Alondioma" }
        ], interaction)

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "inic.ping.titulo"))
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/NqmwCA9.png")
            .setDescription(`${client.tls.phrase(user, "inic.ping.boas_vindas")}\n\n${client.defaultEmoji("earth")} | ${client.tls.phrase(user, "inic.ping.idioma_dica")}`)

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    }
}