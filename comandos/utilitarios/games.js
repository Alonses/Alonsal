const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const create_buttons = require('../../adm/discord/create_buttons')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('games')
        .setNameLocalizations({
            "es-ES": 'juegos',
            "fr": 'jeux',
            "it": 'giochi',
            "ru": 'игры'
        })
        .setDescription('⌠💡⌡ The free game(s) of the moment')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ O(s) jogo(s) gratuito(s) do momento',
            "es-ES": '⌠💡⌡ El(los) juego(s) gratuito(s) del momento',
            "fr": '⌠💡⌡ Le(s) jeu(x) gratuit(s) du moment',
            "it": '⌠💡⌡ Il/i gioco/i gratuito/i del momento',
            "ru": '⌠💡⌡ Текущие бесплатные игры'
        }),
    async execute(client, user, interaction) {

        await interaction.deferReply()

        fetch(`${process.env.url_apisal}/games`)
            .then(response => response.json())
            .then(async res => {

                let jogos_disponiveis = []
                let objeto_jogos = []

                res.forEach(valor => {
                    let nome_jogo = valor.nome.length > 20 ? `${valor.nome.slice(0, 20)}...` : valor.nome

                    jogos_disponiveis.push(`- ${valor.nome} [ ${client.tls.phrase(user, "mode.anuncio.ate_data")} ${valor.expira} ]`)
                    objeto_jogos.push({ name: nome_jogo, type: 4, value: valor.link })
                })

                // Criando os botões externos para os jogos
                const row = create_buttons(objeto_jogos)

                const embed = new EmbedBuilder()
                    .setTitle(client.tls.phrase(user, "mode.anuncio.ativos"))
                    .setThumbnail(res[0].thumbnail)
                    .setColor(client.embed_color(user.misc.color))
                    .setDescription(`${client.tls.phrase(user, "mode.anuncio.resgate_dica")}\n\`\`\`${jogos_disponiveis.join("\n")}\`\`\``)

                interaction.editReply({ embeds: [embed], components: [row], ephemeral: user.misc.ghost_mode })
            })
    }
}