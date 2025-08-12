const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("git")
        .setDescription("⌠📡⌡ The Alonsal™️ repository")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Das Alonsal™️-Repository',
            "es-ES": '⌠📡⌡ El repositorio de Alonsal™️',
            "fr": '⌠📡⌡ Le référentiel Alonsal™️',
            "it": '⌠📡⌡ Il repository Alonsal™️',
            "pt-BR": '⌠📡⌡ O repositório do Alonsal™️',
            "ru": '⌠📡⌡ Репозиторий Алонсал™'
        }),
    async execute({ client, user, interaction }) {

        const row = client.create_buttons([
            { name: "GitHub", type: 4, emoji: "🌐", value: "https://github.com/Alonses/Alonsal" },
            { name: "Alondioma", type: 4, emoji: "🏴‍☠️", value: "https://github.com/Alonses/Alondioma" }
        ])

        const embed = client.create_embed({
            title: { tls: "manu.git.repositorio" },
            image: "https://opengraph.githubassets.com/fdf519dd27d0e74ea9d8bbe7fa3f5d6389608a04fd484dd3fbca5ebe737d72e5/Alonses/Alonsal",
            description: { tls: "manu.git.link" },
            author: {
                name: "GitHub",
                iconURL: "https://cdn-icons-png.flaticon.com/512/25/25231.png"
            }
        }, user)

        interaction.reply({
            embeds: [embed],
            components: [row],
            flags: "Ephemeral"
        })
    }
}