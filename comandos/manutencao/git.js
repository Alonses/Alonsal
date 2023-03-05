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

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "manu.git.repositorio"))
            .setURL("https://github.com/Alonses/Alonsal")
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/0tV3IQr.png")
            .setDescription(client.tls.phrase(user, "manu.git.link"))
            .setAuthor({ name: "GitHub", iconURL: "https://cdn-icons-png.flaticon.com/512/25/25231.png" })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}