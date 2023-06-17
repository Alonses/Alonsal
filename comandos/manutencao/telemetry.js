const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("telemetry")
        .setNameLocalizations({
            "pt-BR": 'telemetria',
            "es-ES": 'telemetria',
            "fr": 'telemetrie',
            "it": 'telemetria',
            "ru": 'телеметрия'
        })
        .setDescription("⌠📡⌡ Data we collect")
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Dados que coletamos',
            "es-ES": '⌠📡⌡ Datos que recopilamos',
            "fr": '⌠📡⌡ Données que nous collectons',
            "it": '⌠📡⌡ Dati che raccogliamo',
            "ru": '⌠📡⌡ Данные, которые мы собираем'
        }),
    async execute(client, user, interaction) {

        const embed = new EmbedBuilder()
            .setColor(client.embed_color(user.misc.color))
            .setTitle(client.tls.phrase(user, "manu.telemetria.titulo"))
            .setDescription(client.tls.phrase(user, "manu.telemetria.descricao"))
            .setImage("https://cdn.discordapp.com/attachments/987852330064039988/1049109914120884224/image.png")
            .setFooter({ text: client.tls.phrase(user, "manu.telemetria.rodape") })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}