const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const create_buttons = require('../../adm/discord/create_buttons')
const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('⌠🌎⌡ It all starts here')
        .setDescriptionLocalizations({
            "pt-BR": '⌠🌎⌡ Tudo começa por aqui',
            "es-ES": '⌠🌎⌡ Todo comienza aquí',
            "fr": '⌠🌎⌡ Tout commence ici'
        }),
    async execute(client, interaction) {

        const user = client.usuarios.getUser(interaction.user.id)

        const row = create_buttons([{ name: client.tls.phrase(client, interaction, "inic.ping.site"), value: 'http://alonsal.glitch.me/', type: 4 }, { name: client.tls.phrase(client, interaction, "inic.inicio.suporte"), value: `https://discord.gg/ZxHnxQDNwn`, type: 4, emoji: emojis.icon_rules_channel }], interaction)

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(client, interaction, "inic.ping.titulo"))
            .setColor(user.misc.embed)
            .setImage('https://i.imgur.com/NqmwCA9.png')
            .setDescription(client.tls.phrase(client, interaction, "inic.ping.boas_vindas"))
            .setFooter({ text: client.tls.phrase(client, interaction, "inic.ping.idioma_dica") })

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}