const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_send_vote")
        .setDescription("⌠🤖⌡ Verificar os resultados da votação")
        .addStringOption(option =>
            option.setName("canal")
                .setDescription("O canal que será enviado")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        const id_alvo = interaction.options.getString("canal")

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

        client.notify(id_alvo, { embed: embed, components: row })
    }
}