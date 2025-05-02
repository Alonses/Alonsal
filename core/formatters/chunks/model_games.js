const { redes } = require('../../../files/json/text/anuncio.json')

function model_games(client, objeto_anunciado, plataforma, idioma_definido) {

    const { data } = require(`../../../files/languages/${idioma_definido}.json`)
    const game = data.game, mode = data.mode

    let texto_formatado, valor_total = 0
    plataforma = plataforma.split(" ")[0]

    objeto_anunciado.forEach(item => { valor_total += parseFloat(item.price) })
    valor_total = valor_total.toFixed(2)

    // Verificando se há menção do tipo de anúncio
    if (!objeto_anunciado[0].type)
        objeto_anunciado[0].type = "game"

    // Um item anunciado
    texto_formatado = client.replace(game["anuncio"][`anuncio_${objeto_anunciado[0].type}_1`], [nome_games(objeto_anunciado), `<t:${objeto_anunciado[0].expirationDate.getTime() / 1000}:D>`, valor_total, plataforma])

    if (objeto_anunciado.length > 1) { // Vários itens anunciados
        const jogos_disponiveis = []

        objeto_anunciado.forEach(game => {
            const matches = game.url.match(client.cached.game_stores)
            let preco = `R$ ${game.price}`, logo_plataforma = client.emoji(redes[matches[0]][0])

            if (game.price === 0)
                preco = mode["anuncio"]["ficara_pago"]

            jogos_disponiveis.push(`- \`${game.name}\`\n[ ${logo_plataforma} \`${preco}\` | ${mode["anuncio"]["ate_data"]} <t:${game.expirationDate.getTime() / 1000}:D> ]`)
        })

        texto_formatado = `${client.replace(mode["anuncio"]["games_gratuitos"], client.emoji("emojis_dancantes"))}\n\n${jogos_disponiveis.join("\n\n")}`
    }

    return texto_formatado
}

nome_games = (objeto_anunciado) => {

    let str = ""

    if (objeto_anunciado.length > 1) {
        objeto_anunciado.forEach(valor => str += `_\`${valor.name}\`_, `)

        return str.slice(0, str.length - 2).replaceAll(", ", " & ")
    } else return `_\`${objeto_anunciado[0].name}\`_`
}

module.exports = {
    model_games
}