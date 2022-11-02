module.exports = (objeto_anunciado, plataforma, idioma_definido) => {

    const { games } = require(`../../arquivos/idiomas/${idioma_definido}.json`)

    let texto_formatado, valor_total = 0
    plataforma = plataforma.split(" ")[0]

    objeto_anunciado.forEach(item => {
        valor_total += parseFloat(item.preco)
    })

    valor_total = valor_total.toFixed(2)

    // Escolhendo o caso e o texto que será usado para o anúncio
    if (objeto_anunciado[0].tipo !== "dlc") {

        texto_formatado = texto_formatado = games[0]["anuncio_game_1"].replace("nomes_repl", nome_games(objeto_anunciado)).replace("data_repl", objeto_anunciado[0].expira).replace("valor_repl", valor_total).replace("plat_repl", plataforma)

        if (objeto_anunciado.length > 1)
            texto_formatado = texto_formatado = games[0]["anuncio_game_2"].replace("nomes_repl", nome_games(objeto_anunciado)).replace("data_repl", objeto_anunciado[0].expira).replace("valor_repl", valor_total).replace("plat_repl", plataforma)

    } else if (objeto_anunciado[0].tipo === "dlc") {

        texto_formatado = texto_formatado = games[0]["anuncio_dlc_1"].replace("nomes_repl", nome_games(objeto_anunciado)).replace("data_repl", objeto_anunciado[0].expira).replace("valor_repl", valor_total).replace("plat_repl", plataforma)

        if (objeto_anunciado.length > 1)
            texto_formatado = games[0]["anuncio_dlc_2"].replace("nomes_repl", nome_games(objeto_anunciado)).replace("data_repl", objeto_anunciado[0].expira).replace("valor_repl", valor_total).replace("plat_repl", plataforma)
    }

    return texto_formatado
}

function nome_games(objeto_anunciado) {

    let str = ""

    if (objeto_anunciado.length > 1) {
        objeto_anunciado.forEach(valor => str += `_\`${valor.nome}\`_, `)

        return str.slice(0, str.length - 2).replaceAll(", ", " & ")
    } else {
        return `_\`${objeto_anunciado[0].nome}\`_`
    }
}