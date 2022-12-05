const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { getUser } = require("../../adm/database/schemas/User.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('telemetry')
        .setNameLocalizations({
            "pt-BR": 'telemetria',
            "es-ES": 'telemetria',
            "fr": 'telemetrie',
            "it": 'telemetria'
        })
        .setDescription('⌠📡⌡ Data we collect')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Dados que coletamos',
            "es-ES": '⌠📡⌡ Datos que recopilamos',
            "fr": '⌠📡⌡ Données que nous collectons',
            "it": '⌠📡⌡ Dati che raccogliamo'
        }),
    async execute(client, interaction) {

        const user = await getUser(interaction.user.id)

        const embed = new EmbedBuilder()
            .setColor(client.embed_color(user.misc.color))
            .setTitle(client.tls.phrase(client, interaction, "manu.telemetria.titulo"))
            .setDescription(client.tls.phrase(client, interaction, "manu.telemetria.descricao"))
            .setImage("https://cdn.discordapp.com/attachments/987852330064039988/1049109914120884224/image.png")
            .setFooter({ text: client.tls.phrase(client, interaction, "manu.telemetria.rodape") })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}