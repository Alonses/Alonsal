const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { existsSync } = require('fs')

const busca_badges = require('../../adm/funcoes/busca_badges.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badges')
        .setDescription('⌠👤⌡ See your badges')
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Veja suas badges',
            "es-ES": '⌠👤⌡ Ver tus insignias',
            "fr": '⌠👤⌡ Voir vos badges'
        }),
    async execute(client, interaction) {

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        // Procurando pelas badges antes do comando
        if (!existsSync(`./arquivos/data/badges/${interaction.user.id}.json`))
            return interaction.reply({ content: `:mag: | ${diversao[9]["error_1"]}`, ephemeral: true })

        const embed = new EmbedBuilder()
            .setTitle(`> ${diversao[9]["suas_badges"]}`)
            .setColor(0x29BB8E)
            .setDescription(busca_badges(client, 'all', interaction.user.id, interaction))
            .setFooter({ text: diversao[9]["rodape"] })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}