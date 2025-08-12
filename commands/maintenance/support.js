const { SlashCommandBuilder } = require('discord.js')

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
        .setDescription("⌠📡⌡ Support Alonsal")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Unterstützen Sie Alonsal',
            "es-ES": '⌠📡⌡ Apoya a Alonsal',
            "fr": '⌠📡⌡ Soutenez Alonsal',
            "it": '⌠📡⌡ Supporta Alonsal',
            "pt-BR": '⌠📡⌡ Dê suporte ao Alonsal',
            "ru": '⌠📡⌡ Поддержите Alonsal™️'
        }),
    async execute({ client, user, interaction }) {

        const row = client.create_buttons([
            { name: { tls: "manu.apoio.contribua", alvo: user }, type: 4, emoji: client.emoji("mc_bolo"), value: "https://picpay.me/slondo" },
            { name: "Buy a Coffee!", type: 4, emoji: "☕", value: "https://www.buymeacoffee.com/slondo" }
        ], interaction)

        const embed = client.create_embed({
            title: `${client.tls.phrase(user, "manu.apoio.apoie")} ${client.emoji("mc_bolo")}`,
            image: "https://i.imgur.com/VCneT1l.png",
            description: { tls: "manu.apoio.escaneie" },
        }, user)

        interaction.reply({
            embeds: [embed],
            components: [row],
            flags: "Ephemeral"
        })
    }
}