const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emoji")
        .setDescription("⌠😂⌡ Increase emojis")
        .setDescriptionLocalizations({
            "pt-BR": '⌠😂⌡ Amplie os emojis',
            "es-ES": '⌠😂⌡ Ampliar emojis',
            "fr": '⌠😂⌡ Augmenter les émoticônes',
            "it": '⌠😂⌡ Aumenta le emoticon',
            "ru": '⌠😂⌡ Увеличить смайлики'
        })
        .addStringOption(option =>
            option.setName("emoji")
                .setDescription(":the name of the emoji:")
                .setDescriptionLocalizations({
                    "pt-BR": ":o nome do emoji:",
                    "es-ES": ':el nombre del emoji:',
                    "fr": ':le nom de l\'emoji:',
                    "it": ':il nome dell\'emoji:',
                    "ru": ':название смайлика:'
                })
                .setRequired(true)),
    async execute(client, user, interaction) {

        const dados = interaction.options.data[0].value

        try {
            if (dados.startsWith("<") && dados.endsWith(">")) {
                const id = dados.match(/\d{15,}/g)[0]
                let url_emoji = `https://cdn.discordapp.com/emojis/${id}.gif`

                fetch(url_emoji)
                    .then(image => {
                        // Validando se o arquivo do emoji é um gif
                        if (image.status === 415) url_emoji = url_emoji.replace(".gif", ".png")

                        interaction.reply({ content: url_emoji, ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
                    })
            } else
                client.tls.reply(interaction, user, "mode.emojis.emoji_custom", true, 2)
        } catch { client.tls.reply(interaction, user, "mode.emojis.emoji_custom", true, 2) }
    }
}