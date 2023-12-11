const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("git")
        .setDescription("⌠📡⌡ The Alon™️ repository")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Das Alon™️-Repository',
            "es-ES": '⌠📡⌡ El repositorio de Alon™️',
            "fr": '⌠📡⌡ Le référentiel Alon™️',
            "it": '⌠📡⌡ Il repository Alon™️',
            "pt-BR": '⌠📡⌡ O repositório do Alon™️',
            "ru": '⌠📡⌡ Репозиторий Алонсал™'
        }),
    async execute({ client, user, interaction }) {

        const row = client.create_buttons([
            { name: "GitHub", type: 4, emoji: "🌐", value: "https://github.com/Alonses/Alonsal" },
            { name: "Alondioma", type: 4, emoji: "🏴‍☠️", value: "https://github.com/Alonses/Alondioma" }
        ])

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "manu.git.repositorio"))
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/0tV3IQr.png")
            .setDescription(client.tls.phrase(user, "manu.git.link"))
            .setAuthor({
                name: "GitHub",
                iconURL: "https://cdn-icons-png.flaticon.com/512/25/25231.png"
            })

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    }
}