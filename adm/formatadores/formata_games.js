const { emojis } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require('../discord/busca_emoji.js')

module.exports = (client, objeto_anunciado, plataforma, idioma_definido) => {

    const { data } = require(`../../arquivos/idiomas/${idioma_definido}.json`)
    const game = data.game

    let texto_formatado, valor_total = 0, link_app = ""
    plataforma = plataforma.split(" ")[0]

    objeto_anunciado.forEach(item => {
        valor_total += parseFloat(item.preco)
    })

    if (objeto_anunciado[0].link.match(/store.steam/))
        link_app = `\n\n${busca_emoji(client, emojis.lg_steam)} ${game["anuncio"]["link_app"]}\nsteam://store/${objeto_anunciado[0].link.split("app/")[1].split("/")[0]}`.replace("plat_repl", plataforma)

    valor_total = valor_total.toFixed(2)

    // Escolhendo o caso e o texto que será usado para o anúncio
    if (objeto_anunciado[0].tipo !== "dlc") {

        texto_formatado = texto_formatado = game["anuncio"]["anuncio_game_1"].replace("nomes_repl", nome_games(objeto_anunciado)).replace("data_repl", objeto_anunciado[0].expira).replace("valor_repl", valor_total).replace("plat_repl", plataforma)

        if (objeto_anunciado.length > 1)
            texto_formatado = texto_formatado = game["anuncio"]["anuncio_game_2"].replace("nomes_repl", nome_games(objeto_anunciado)).replace("data_repl", objeto_anunciado[0].expira).replace("valor_repl", valor_total).replace("plat_repl", plataforma)

    } else if (objeto_anunciado[0].tipo === "dlc") {

        texto_formatado = texto_formatado = game["anuncio"]["anuncio_dlc_1"].replace("nomes_repl", nome_games(objeto_anunciado)).replace("data_repl", objeto_anunciado[0].expira).replace("valor_repl", valor_total).replace("plat_repl", plataforma)

        if (objeto_anunciado.length > 1)
            texto_formatado = game["anuncio"]["anuncio_dlc_2"].replace("nomes_repl", nome_games(objeto_anunciado)).replace("data_repl", objeto_anunciado[0].expira).replace("valor_repl", valor_total).replace("plat_repl", plataforma)
    }

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