const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("git")
        .setDescription("⌠📡⌡ The Alonsal™️ repository")
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ O repositório do Alonsal™️',
            "es-ES": '⌠📡⌡ El repositorio de Alonsal™️',
            "fr": '⌠📡⌡ Le référentiel Alonsal™️',
            "it": '⌠📡⌡ Il repository Alonsal™️',
            "ru": '⌠📡⌡ Репозиторий Алонсал™'
        }),
    async execute(client, user, interaction) {

        const row = client.create_buttons([{ name: "GitHub", type: 4, emoji: "🌐", value: "https://github.com/Alonses/Alonsal" }])

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "manu.git.repositorio"))
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/0tV3IQr.png")
            .setDescription(client.tls.phrase(user, "manu.git.link"))
            .setAuthor({ name: "GitHub", iconURL: "https://cdn-icons-png.flaticon.com/512/25/25231.png" })

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}