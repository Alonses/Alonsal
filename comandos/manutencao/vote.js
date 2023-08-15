const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setNameLocalizations({
            "pt-BR": 'votar',
            "es-ES": 'votar',
            "it": 'votazione',
            "ru": 'голосование'
        })
        .setDescription("⌠📡⌡ Vote for the new language!")
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Vote num novo idioma!',
            "es-ES": '⌠📡⌡ ¡Vota por un nuevo idioma!',
            "fr": '⌠📡⌡ Votez pour une nouvelle langue!',
            "it": '⌠📡⌡ Vota per la nuova lingua!',
            "ru": '⌠📡⌡ Голосуйте за новый язык!'
        }),
    async execute(client, user, interaction) {

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "inic.vote.titulo")} ${client.emoji(emojis_dancantes)}`)
            .setColor(0x29BB8E)
            .setDescription(`${client.replace(client.tls.phrase(user, "inic.vote.descricao"), [client.emoji(emojis_dancantes), client.emoji(emojis_dancantes)])} <t:1692460800:f>!\n\n:flag_de: :flag_nl: :flag_se: :flag_tr: :flag_jp: :flag_de: :flag_nl: :flag_se: :flag_tr: :flag_jp:\n:flag_nl: :flag_se: :flag_tr: :flag_jp: :flag_de: :flag_nl: :flag_se: :flag_tr: :flag_jp: :flag_de:\n:flag_se: :flag_tr: :flag_jp: :flag_de: :flag_nl: :flag_se: :flag_tr: :flag_jp: :flag_de: :flag_nl:`)
            .setFooter({
                text: client.tls.phrase(user, "inic.vote.rodape")
            })

        const row = client.create_buttons([
            { id: "vote_button", name: 'Deutsch', emoji: "🇩🇪", type: 1, data: "de" },
            { id: "vote_button", name: 'Nederlands', emoji: "🇳🇱", type: 1, data: "nl" },
            { id: "vote_button", name: 'Svenska', emoji: "🇸🇪", type: 1, data: "se" },
            { id: "vote_button", name: 'Türkçe', emoji: "🇹🇷", type: 1, data: "tr" },
            { id: "vote_button", name: '日本語', emoji: "🇯🇵", type: 1, data: "jp" }
        ], interaction)

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }
}