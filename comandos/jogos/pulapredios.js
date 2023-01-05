const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { getUser } = require("../../adm/database/schemas/User.js")
const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pulapredios')
        .setDescription('⌠🎲|🇧🇷⌡ O Jogo do Pula!'),
    async execute(client, interaction) {

        const user = await getUser(interaction.user.id)

        const embed = new EmbedBuilder()
            .setColor(client.embed_color(user.misc.color))
            .setTitle(`> Pula Prédios ${client.emoji(emojis.pula_2)}`)
            .setURL('https://gamejolt.com/games/pula-predios/613946')
            .setImage('https://m.gjcdn.net/game-header/1300/613946-crop0_236_1366_606-xqiv88ik-v4.webp')
            .setDescription(client.tls.phrase(client, interaction, "game.pula.conteudo"))
            .setFooter({ text: client.tls.phrase(client, interaction, "game.pula.rodape") })

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }
}