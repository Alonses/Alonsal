const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("games")
        .setNameLocalizations({
            "es-ES": 'juegos',
            "fr": 'jeux',
            "it": 'giochi',
            "ru": 'игры'
        })
        .setDescription("⌠💡⌡ The free game(s) of the moment")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ O(s) jogo(s) gratuito(s) do momento',
            "es-ES": '⌠💡⌡ El(los) juego(s) gratuito(s) del momento',
            "fr": '⌠💡⌡ Le(s) jeu(x) gratuit(s) du moment',
            "it": '⌠💡⌡ Il/i gioco/i gratuito/i del momento',
            "ru": '⌠💡⌡ Текущие бесплатные игры'
        }),
    async execute(client, user, interaction) {

        fetch(`${process.env.url_apisal}/games`)
            .then(response => response.json())
            .then(async res => {

                let jogos_disponiveis = []
                let objeto_jogos = []

                res.forEach(valor => {
                    let nome_jogo = valor.nome.length > 20 ? `${valor.nome.slice(0, 20)}...` : valor.nome

                    jogos_disponiveis.push(`- ${valor.nome} [ ${client.tls.phrase(user, "mode.anuncio.ate_data")} ${valor.expira} ]`)
                    objeto_jogos.push({
                        name: nome_jogo,
                        type: 4,
                        value: valor.link
                    })
                })

                // Criando os botões externos para os jogos
                const row = client.create_buttons(objeto_jogos)

                const embed = new EmbedBuilder()
                    .setTitle(client.tls.phrase(user, "mode.anuncio.ativos"))
                    .setColor(client.embed_color(user.misc.color))
                    .setThumbnail(res[0].thumbnail)
                    .setDescription(`${client.tls.phrase(user, "mode.anuncio.resgate_dica")}\n\`\`\`${jogos_disponiveis.join("\n")}\`\`\``)

                interaction.reply({
                    embeds: [embed],
                    components: [row],
                    ephemeral: client.decider(user?.conf.ghost_mode, 0)
                })
            })
    }
}