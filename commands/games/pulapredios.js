const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pulapredios")
        .setDescription("⌠🎲⌡ The Pula Game!")
        .setDescriptionLocalizations({
            "de": '⌠🎲⌡ Das Pula-Spiel!',
            "es-ES": '⌠🎲⌡ ¡El Juego de Pula!',
            "fr": '⌠🎲⌡ Le Jeu Pula!',
            "it": '⌠🎲⌡ Il gioco di Pola!',
            "pt-BR": '⌠🎲⌡ O Jogo do Pula!',
            "ru": '⌠🎲⌡ Игра от Pula!'
        }),
    async execute({ client, user, interaction }) {

        const row = client.create_buttons([
            { name: client.tls.phrase(user, "game.pula.jogar_agora"), type: 4, emoji: client.emoji("pula_2"), value: "https://gamejolt.com/games/pula-predios/613946" }
        ], interaction)

        const embed = new EmbedBuilder()
            .setTitle(`> Pula Prédios ${client.emoji("pula_2")}`)
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://m.gjcdn.net/game-header/1300/613946-crop0_236_1366_606-xqiv88ik-v4.webp")
            .setDescription(client.tls.phrase(user, "game.pula.conteudo"))
            .setFooter({
                text: client.tls.phrase(user, "game.pula.rodape")
            })

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    }
}