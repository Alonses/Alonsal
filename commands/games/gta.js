const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gta")
        .setDescription("⌠🎲⌡ GTA Online information")
        .setDescriptionLocalizations({
            "de": '⌠🎲⌡ GTA Online-Infos',
            "es-ES": '⌠🎲⌡ Información de GTA Online',
            "fr": '⌠🎲⌡ Informations sur GTA Online',
            "it": '⌠🎲⌡ Informazioni su GTA Online',
            "pt-BR": '⌠🎲⌡ Informações do GTA Online',
            "ru": '⌠🎲⌡ ГТА Онлайн информация'
        }),
    async execute(client, user, interaction) {

        fetch(`${process.env.url_apisal}/gta?idioma=${user.lang}`)
            .then(response => response.json())
            .then(async data => {

                let emoji_horario = data.gameTimeStr.slice(0, 2) < 20 && data.gameTimeStr.slice(0, 2) > 6 ? data.gameTimeStr.slice(0, 2) > 17 ? ":city_sunset:" : ":park:" : ":bridge_at_night:"

                let hours = data.gameTimeStr.split(":")[0] % 12
                hours = hours ? hours : 12

                if (data.gameTimeStr.split(":")[1] >= 30)
                    hours += "30"

                const embed = new EmbedBuilder()
                    .setTitle("> This is Weazel News")
                    .setColor(client.embed_color(user.misc.color))
                    .setDescription(`\`\`\`${data.currentWeatherEmoji} - ${data.currentWeatherDescription}\`\`\``)
                    .addFields(
                        {
                            name: client.tls.phrase(user, "game.gta.horario_atual"),
                            value: `:clock${hours}: \`${data.gameTimeStr}\`${emoji_horario}\` \``,
                            inline: true
                        }
                    )

                interaction.reply({
                    embeds: [embed],
                    ephemeral: client.decider(user?.conf.ghost_mode, 0)
                })
            })
            .catch(() => client.tls.reply(interaction, user, "game.gta.erro_apisal", true, client.emoji(0)))
    }
}