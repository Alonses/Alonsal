const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("⌠🌎⌡ It all starts here")
        .setDescriptionLocalizations({
            "pt-BR": '⌠🌎⌡ Tudo começa por aqui',
            "es-ES": '⌠🌎⌡ Todo comienza aquí',
            "fr": '⌠🌎⌡ Tout commence ici',
            "it": '⌠🌎⌡ Tutto inizia qui',
            "ru": '⌠🌎⌡ Все начинается здесь'
        }),
    async execute(client, user, interaction) {

        const row = client.create_buttons([{ name: client.tls.phrase(user, "inic.ping.site"), value: 'http://alonsal.glitch.me/', type: 4 }, { name: client.tls.phrase(user, "inic.inicio.suporte"), value: process.env.url_support, type: 4, emoji: emojis.icon_rules_channel }], interaction)

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "inic.ping.titulo"))
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/NqmwCA9.png")
            .setDescription(`${client.tls.phrase(user, "inic.ping.boas_vindas")}\n\n${client.defaultEmoji("earth")} | ${client.tls.phrase(user, "inic.ping.idioma_dica")}`)

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}