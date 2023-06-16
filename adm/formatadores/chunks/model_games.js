function model_games(client, objeto_anunciado, plataforma, idioma_definido) {

    const { data } = require(`../../../arquivos/idiomas/${idioma_definido}.json`)
    const game = data.game

    let texto_formatado, valor_total = 0, link_app = ""
    plataforma = plataforma.split(" ")[0]

    objeto_anunciado.forEach(item => {
        valor_total += parseFloat(item.preco)
    })

    valor_total = valor_total.toFixed(2)

    // Verificando se há menção do tipo de anúncio
    if (!objeto_anunciado[0].tipo)
        objeto_anunciado[0].tipo = "game"

    if (objeto_anunciado[0].link.match(/store.steam/))
        link_app = client.replace(`\n\n${client.emoji("lg_steam")} ${game["anuncio"]["link_app"]}\nsteam://store/${objeto_anunciado[0].link.split("app/")[1].split("/")[0]}`, plataforma)

    // Um item anunciado
    texto_formatado = client.replace(game["anuncio"][`anuncio_${objeto_anunciado[0].tipo}_1`], [nome_games(objeto_anunciado), objeto_anunciado[0].expira, valor_total, plataforma])

    if (objeto_anunciado.length > 1) // Vários itens anunciados
        texto_formatado = client.replace(game["anuncio"][`anuncio_${objeto_anunciado[0].tipo}_2`], [nome_games(objeto_anunciado), objeto_anunciado[0].expira, valor_total, plataforma])

    return `${texto_formatado}${link_app}`
}

function nome_games(objeto_anunciado) {

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