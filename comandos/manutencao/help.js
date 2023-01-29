const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')
const create_buttons = require('../../adm/discord/create_buttons')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('⌠🌎⌡ It all starts here')
        .setDescriptionLocalizations({
            "pt-BR": '⌠🌎⌡ Tudo começa por aqui',
            "es-ES": '⌠🌎⌡ Todo comienza aquí',
            "fr": '⌠🌎⌡ Tout commence ici',
            "it": '⌠🌎⌡ Tutto inizia qui'
        }),
    async execute(client, user, interaction) {

        const row = create_buttons([{ name: client.tls.phrase(user, "inic.ping.site"), value: 'http://alonsal.glitch.me/', type: 4 }, { name: client.tls.phrase(user, "inic.inicio.suporte"), value: `https://discord.gg/ZxHnxQDNwn`, type: 4, emoji: emojis.icon_rules_channel }], interaction)

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "inic.ping.titulo"))
            .setColor(client.embed_color(user.misc.color))
            .setImage('https://i.imgur.com/NqmwCA9.png')
            .setDescription(client.tls.phrase(user, "inic.ping.boas_vindas"))
            .setFooter({ text: client.tls.phrase(user, "inic.ping.idioma_dica") })

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}