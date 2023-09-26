const { redes } = require('../../../files/json/text/anuncio.json')

function model_games(client, objeto_anunciado, plataforma, idioma_definido) {

    const { data } = require(`../../../files/languages/${idioma_definido}.json`)
    const game = data.game, mode = data.mode

    let texto_formatado, valor_total = 0, link_app = ""
    plataforma = plataforma.split(" ")[0]

    objeto_anunciado.forEach(item => {
        valor_total += parseFloat(item.preco)
    })

    valor_total = valor_total.toFixed(2)

    // Verificando se há menção do tipo de anúncio
    if (!objeto_anunciado[0].tipo)
        objeto_anunciado[0].tipo = "game"

    if (objeto_anunciado[0].link.match(/store.steam/) && objeto_anunciado.length < 2)
        link_app = client.replace(`\n\n${client.emoji("lg_steam")} ${game["anuncio"]["link_app"]}\nsteam://store/${objeto_anunciado[0].link.split("app/")[1].split("/")[0]}`, plataforma)

    // Um item anunciado
    texto_formatado = client.replace(game["anuncio"][`anuncio_${objeto_anunciado[0].tipo}_1`], [nome_games(objeto_anunciado), `<t:${objeto_anunciado[0].expira}:D>`, valor_total, plataforma])

    if (objeto_anunciado.length > 1) { // Vários itens anunciados
        const jogos_disponiveis = []

        objeto_anunciado.forEach(game => {
            const matches = game.link.match(/epicgames.com|store.steam|gog.com|humblebundle.com|ubisoft.com|store.ubi.com|xbox.com|play.google|beta.bandainamcoent|microsoft.com/)
            let preco = `R$ ${game.preco}`, logo_plataforma = redes[matches[0]][0]

            if (game.preco === 0)
                preco = mode["anuncio"]["ficara_pago"]

            jogos_disponiveis.push(`- \`${game.nome}\`\n[ ${logo_plataforma} \`${preco}\` | ${mode["anuncio"]["ate_data"]} <t:${game.expira}:D> ]`)
        })

        texto_formatado = `${client.replace(mode["anuncio"]["games_gratuitos"], client.emoji("emojis_dancantes"))}\n\n${jogos_disponiveis.join("\n\n")}`
    }

    return `${texto_formatado}${link_app}`
}

nome_games = (objeto_anunciado) => {

    let str = ""

    if (objeto_anunciado.length > 1) {
        objeto_anunciado.forEach(valor => str += `_\`${valor.nome}\`_, `)

        return str.slice(0, str.length - 2).replaceAll(", ", " & ")
    } else
        return `_\`${objeto_anunciado[0].nome}\`_`
}

module.exports = {
    model_games
}