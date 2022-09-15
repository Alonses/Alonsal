const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const create_buttons = require('../../adm/funcoes/create_buttons')
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

        const { inicio, updates } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        const row = create_buttons([{ name: inicio[1]["site"], value: 'http://alonsal.glitch.me/', type: 4 }, { name: updates[0]["suporte"], value: `https://discord.gg/ZxHnxQDNwn`, type: 4, emoji: emojis.icon_rules_channel }])

        const embed = new EmbedBuilder()
            .setTitle(inicio[1]["titulo"])
            .setColor(0x29BB8E)
            .setImage('https://i.imgur.com/NqmwCA9.png')
            .setDescription(`${inicio[1]["boas_vindas"]}`)
            .setFooter({ text: inicio[1]["idioma_dica"] })

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}