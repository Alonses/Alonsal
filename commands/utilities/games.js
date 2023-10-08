const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { getGames, verifyInvalidGames } = require('../../core/database/schemas/Game')

const { redes } = require('../../files/json/text/anuncio.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("games")
        .setNameLocalizations({
            "de": 'spiele',
            "es-ES": 'juegos',
            "fr": 'jeux',
            "it": 'giochi',
            "ru": 'игры'
        })
        .setDescription("⌠💡⌡ The free game(s) of the moment")
        .setDescriptionLocalizations({
            "de": '⌠💡⌡ Die neuesten kostenlosen Spiele',
            "es-ES": '⌠💡⌡ El(los) juego(s) gratuito(s) del momento',
            "fr": '⌠💡⌡ Le(s) jeu(x) gratuit(s) du moment',
            "it": '⌠💡⌡ Il/i gioco/i gratuito/i del momento',
            "pt-BR": '⌠💡⌡ O(s) jogo(s) gratuito(s) do momento',
            "ru": '⌠💡⌡ Текущие бесплатные игры'
        }),
    async execute({ client, user, interaction }) {

        // Verificando pelos games que já expiraram
        await verifyInvalidGames()

        // Listando os games que estão gratuitos no momento
        const games = await getGames()
        let jogos_disponiveis = [], objeto_jogos = []

        games.forEach(game => {

            const nome_jogo = game.nome.length > 20 ? `${game.nome.slice(0, 20)}...` : game.nome
            const matches = game.link.match(/epicgames.com|store.steam|gog.com|humblebundle.com|ubisoft.com|store.ubi.com|xbox.com|play.google|beta.bandainamcoent|microsoft.com/)
            let preco = `R$ ${game.preco}`, logo_plataforma = redes[matches[0]][0]

            if (game.preco === 0)
                preco = client.tls.phrase(user, "mode.anuncio.ficara_pago")

            jogos_disponiveis.push(`- \`${game.nome}\`\n[ ${logo_plataforma} \`${preco}\` | ${client.tls.phrase(user, "mode.anuncio.ate_data")} <t:${game.expira}:D> ]`)
            objeto_jogos.push({
                name: nome_jogo,
                type: 4,
                value: game.link
            })
        })

        if (games.length < 1)
            return client.tls.reply(interaction, user, "mode.anuncio.sem_games", true, client.emoji("this_cannot_be_happening"))

        // Criando os botões externos para os jogos
        const row = client.create_buttons(objeto_jogos)

        const embed = new EmbedBuilder()
            .setTitle(`> ${client.tls.phrase(user, "mode.anuncio.ativos")} ${client.emoji("emojis_dancantes")}`)
            .setColor(client.embed_color(user.misc.color))
            .setThumbnail(games[0]?.thumbnail || "https://i.imgur.com/AEkiKGU.jpg")
            .setDescription(`${client.tls.phrase(user, "mode.anuncio.resgate_dica")}\n\n${jogos_disponiveis.join("\n\n")}`)

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }
}