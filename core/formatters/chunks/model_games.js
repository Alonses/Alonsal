const { redes } = require('../../../files/json/text/anuncio.json')

function model_games(client, objeto_anunciado, plataforma, idioma_definido) {

    const { data } = require(`../../../files/languages/${idioma_definido}.json`)
    const game = data.game, mode = data.mode

    let texto_formatado, valor_total = 0
    plataforma = plataforma.split(" ")[0]

    objeto_anunciado.forEach(item => { valor_total += parseFloat(item.preco) })
    valor_total = valor_total.toFixed(2)

    // Verificando se há menção do tipo de anúncio
    if (!objeto_anunciado[0].tipo)
        objeto_anunciado[0].tipo = "game"

    // Um item anunciado
    texto_formatado = client.replace(game["anuncio"][`anuncio_${objeto_anunciado[0].tipo}_1`], [nome_games(objeto_anunciado), `<t:${objeto_anunciado[0].expira}:D>`, valor_total, plataforma])

    if (objeto_anunciado.length > 1) { // Vários itens anunciados
        const jogos_disponiveis = []

        objeto_anunciado.forEach(game => {
            const matches = game.link.match(client.cached.game_stores)
            let preco = `R$ ${game.preco}`, logo_plataforma = client.emoji(redes[matches[0]][0])

            if (game.preco === 0)
                preco = mode["anuncio"]["ficara_pago"]

            jogos_disponiveis.push(`- \`${game.nome}\`\n[ ${logo_plataforma} \`${preco}\` | ${mode["anuncio"]["ate_data"]} <t:${game.expira}:D> ]`)
        })

        texto_formatado = `${client.replace(mode["anuncio"]["games_gratuitos"], client.emoji("emojis_dancantes"))}\n\n${jogos_disponiveis.join("\n\n")}`
    }

    return texto_formatado
}

nome_games = (objeto_anunciado) => {

    let str = ""

    if (objeto_anunciado.length > 1) {
        objeto_anunciado.forEach(valor => str += `_\`${valor.nome}\`_, `)

        return str.slice(0, str.length - 2).replaceAll(", ", " & ")
    } else return `_\`${objeto_anunciado[0].nome}\`_`
}

module.exports = {
    model_games
}