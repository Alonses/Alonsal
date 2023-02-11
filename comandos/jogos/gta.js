const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gta")
        .setDescription("⌠🎲⌡ GTA Online information")
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎲⌡ Informações do GTA Online',
            "es-ES": '⌠🎲⌡ Información de GTA Online',
            "fr": '⌠🎲⌡ Informations sur GTA Online',
            "it": '⌠🎲⌡ Informazioni su GTA Online',
            "ru": '⌠🎲⌡ ГТА Онлайн информация'
        }),
    async execute(client, user, interaction) {

        fetch(`${process.env.url_apisal}/gta`)
            .then(response => response.json())
            .then(async data => {

                // let emoji_horario = data.gameTimeStr.slice(0, 2) < 20 && data.gameTimeStr.slice(0, 2) > 6 ? data.gameTimeStr.slice(0, 2) > 17 ? ":city_sunset:" : ":park:" : ":bridge_at_night:"

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
                            name: `Horário atual`,
                            value: `:clock${hours}: \`${data.gameTimeStr}\``,
                            inline: true
                        }
                    )
                interaction.reply({ embeds: [embed], ephemeral: user.misc.ghost_mode })
            })
            .catch(err => {
                interaction.reply({ content: ':octagonal_sign: | Não foi possível conectar a APISAL no momento, por favor, tente novamente mais tarde!', ephemeral: true })
            })
    }
}