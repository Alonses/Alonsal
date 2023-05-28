const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("support")
        .setNameLocalizations({
            "pt-BR": 'suporte',
            "es-ES": 'soporte',
            "fr": 'soutien',
            "it": 'supporto',
            "ru": 'поддержка'
        })
        .setDescription("⌠📡⌡ Support Alonsal")
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Dê suporte ao Alonsal',
            "es-ES": '⌠📡⌡ Apoya a Alonsal',
            "fr": '⌠📡⌡ Soutenez Alonsal',
            "it": '⌠📡⌡ Supporta Alonsal',
            "ru": '⌠📡⌡ Поддержите Алонсала'
        }),
    async execute(client, user, interaction) {

        const row = client.create_buttons([{ name: client.tls.phrase(user, "manu.apoio.contribua"), type: 4, emoji: client.emoji(emojis.mc_bolo), value: "https://picpay.me/slondo" }, { name: "Buy a Coffee!", type: 4, emoji: "☕", value: "https://www.buymeacoffee.com/slondo" }], interaction)

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "manu.apoio.apoie")} ${client.emoji(emojis.mc_bolo)}`)
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/VCneT1l.png")
            .setDescription(client.tls.phrase(user, "manu.apoio.escaneie"))

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}