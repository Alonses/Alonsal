const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('git')
        .setDescription('⌠📡⌡ The Alonsal™️ repository')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ O repositório do Alonsal™️',
            "es-ES": '⌠📡⌡ El repositorio de Alonsal™️',
            "fr": '⌠📡⌡ Le référentiel Alonsal™️'
        }),
    async execute(client, interaction) {

        const { manutencao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.custom.getUser(interaction.user.id)

        const embed = new EmbedBuilder()
            .setColor(user.color)
            .setAuthor({ name: 'GitHub', iconURL: 'https://cdn-icons-png.flaticon.com/512/25/25231.png' })
            .setTitle(manutencao[1]["repositorio"])
            .setURL('https://github.com/brnd-21/Alonsal')
            .setImage('https://i.imgur.com/0tV3IQr.png')
            .setDescription(manutencao[1]["link"])

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}