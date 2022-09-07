module.exports = (objeto_anunciado, plataforma, idioma_definido) => {
    
    let texto_formatado, valor_total = 0
    plataforma = plataforma.split(" ")[0]
    
    objeto_anunciado.forEach(item => {
        valor_total += parseFloat(item.preco)
    })

    valor_total = valor_total.toFixed(2)

    // Escolhendo o caso e o texto que será usado para o anúncio
    if (objeto_anunciado[0].tipo !== "dlc" && objeto_anunciado[0].urgencia !== "u") {
        texto_formatado = `O Game _\`${objeto_anunciado[0].nome}\`_ está gratuito até o dia \`${objeto_anunciado[0].expira}\` por lá\n\nResgate ele antes da data para poupar \`R$${objeto_anunciado[0].preco}\` e garantir uma cópia em sua conta ${plataforma}`

        if (idioma_definido === "en-us")
            texto_formatado = `The Game _\`${objeto_anunciado[0].nome}\`_ it's free until the day \`${objeto_anunciado[0].expira}\` over there\n\nRedeem it before date to save \`R$"${objeto_anunciado[0].preco}\` and get a copy in your ${plataforma} account`
        
        if (objeto_anunciado[1]) {
            texto_formatado = `Os Games ${nome_games(objeto_anunciado)} estão gratuitos até o dia \`${objeto_anunciado[0].expira}\` por lá\n\nResgate todos antes da data para poupar \`R$${valor_total}\` e garantir uma cópia em sua conta ${plataforma}`

            if (idioma_definido === "en-us")
                texto_formatado = `The Games ${nome_games(objeto_anunciado)} are free until the day \`"${objeto_anunciado[0].expira}\` over there\n\nRedeem all before date to save \`R$${valor_total}\` and get a copy in your ${plataforma} account`
        }
    } else if (objeto_anunciado[0].tipo === "dlc") {
        texto_formatado = `A DLC _\`${objeto_anunciado[0].nome}\`_ esta gratuita até o dia \`${objeto_anunciado[0].expira}\` por lá\n\nResgate ela antes da data para poupar \`R$${objeto_anunciado[0].preco}\` e garantir uma cópia em sua conta ${plataforma}`

        if (idioma_definido === "en-us")
            texto_formatado = `The DLC _\`${objeto_anunciado[0].nome}\`_ it's free until the day \`${objeto_anunciado[0].expira}\` over there\n\nRedeem it before date to save \`R$"${objeto_anunciado[0].preco}\` and get a copy in your ${plataforma} account`

        if (objeto_anunciado[1]) {
            texto_formatado = `As DLC's ${nome_games(objeto_anunciado)} estão gratuitas até o dia \`${objeto_anunciado[0].expira}\` por lá\n\nResgate ambas antes da data para poupar \`R$${valor_total}\` e garantir uma cópia em sua conta ${plataforma}`

            if (idioma_definido === "en-us")
                texto_formatado = `The DLC's ${nome_games(objeto_anunciado)} are free until the day \`"${objeto_anunciado[0].expira}\` over there\n\nRedeem both before date to save \`R$${valor_total}\` and get a copy in your ${plataforma} account`
        }
    } else if (objeto_anunciado[0].urgencia === "u") {
        texto_formatado = `O Game _\`${objeto_anunciado[0].nome}\`_ está gratuito até o dia \`${objeto_anunciado[0].expira}\` por lá\n\nResgate ele o quanto antes para poupar \`R$${objeto_anunciado[0].preco}\` e garantir uma cópia em sua conta ${plataforma}`

        if (idioma_definido === "en-us")
            texto_formatado = `The Game _\`${objeto_anunciado[0].nome}\`_ it's free until the day \`${objeto_anunciado[0].expira}\` over there\n\nRedeem it as soon as possible to save \`R$"${objeto_anunciado[0].preco}\` and get a copy in your ${plataforma} account`

        if (objeto_anunciado[1]) {
            texto_formatado = `Os Games ${nome_games(objeto_anunciado)} estão gratuitos até o dia \`${objeto_anunciado[0].expira}\` por lá\n\nResgate ambos o quanto antes para poupar \`R$${valor_total}\` e garantir uma cópia em sua conta ${plataforma}`

            if (idioma_definido === "en-us")
                texto_formatado = `The Games ${nome_games(objeto_anunciado)} are free until the day \`"${objeto_anunciado[0].expira}\` over there\n\nRedeem both as soon as possible to save \`R$${valor_total}\` and get a copy in your ${plataforma} account`
        }
    }
    
    return texto_formatado
}

function nome_games(objeto_anunciado){

    let str = ""
    
    objeto_anunciado.forEach(valor => str += `_\`${valor.nome}\`_, `)

    return str.slice(0, str.length - 2).replaceAll(", ", " & ")
}