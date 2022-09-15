const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const busca_emoji = require('../../adm/funcoes/busca_emoji')
const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pulapredios')
        .setDescription('⌠🎲⌡ O Jogo do Pula!'),
    async execute(client, interaction) {

        const { jogos } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const emoji_pula = busca_emoji(client, emojis.pula_2)

        const embed = new EmbedBuilder()
            .setColor(0x29BB8E)
            .setTitle(`> Pula Prédios ${emoji_pula}`)
            .setURL('https://gamejolt.com/games/pula-predios/613946')
            .setImage('https://m.gjcdn.net/game-header/1300/613946-crop0_236_1366_606-xqiv88ik-v4.webp')
            .setDescription(jogos[0]["conteudo"])
            .setFooter({ text: jogos[0]["rodape"] })

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }
}