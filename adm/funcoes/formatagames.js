module.exports = (objeto_anunciado, logo_plat, plataforma, idioma_definido) => {
    
    let texto_formatado

    if(objeto_anunciado.tipo !== "dlc" && objeto_anunciado.urgencia !== "u"){
        texto_formatado = `( ${logo_plat} ) O Game _\`${objeto_anunciado.nome}\`_ está gratuito até o dia \`${objeto_anunciado.expira}\` por lá\n\nResgate ele antes da data para poupar \`R$${objeto_anunciado.preco}\` e garantir uma cópia em sua conta ${plataforma}`

        if(idioma_definido === "en-us")
            texto_formatado = `( ${logo_plat} ) The Game _\`${objeto_anunciado.nome}\`_ it's free until the day \`${objeto_anunciado.expira}\` over there\n\nRedeem it before date to save \`R$"${objeto_anunciado.preco}\` and get a copy in your ${plataforma} account`
        
    }else if(objeto_anunciado.tipo === "dlc"){
        texto_formatado = `( ${logo_plat} ) A DLC _\`${objeto_anunciado.nome}\`_ esta gratuita até o dia \`${objeto_anunciado.expira}\` por lá\n\nResgate ela antes da data para poupar \`R$${objeto_anunciado.preco}\` e garantir uma cópia em sua conta ${plataforma}`

        if(idioma_definido === "en-us")
            texto_formatado = `( ${logo_plat} ) The DLC _\`${objeto_anunciado.nome}\`_ it's free until the day \`${objeto_anunciado.expira}\` over there\n\nRedeem it before date to save \`R$"${objeto_anunciado.preco}\` and get a copy in your ${plataforma} account`

    }else if(objeto_anunciado.urgencia === "u"){
        texto_formatado = `( ${logo_plat} | :rotating_light: :rotating_light: :rotating_light: ) O Game _\`${objeto_anunciado.nome}\`_ está gratuito até o dia \`${objeto_anunciado.expira}\` por lá\n\nResgate ele o quanto antes para poupar \`R$${objeto_anunciado.preco}\` e garantir uma cópia em sua conta ${plataforma}`

        if(idioma_definido === "en-us")
            texto_formatado = `( ${logo_plat} | :rotating_light: :rotating_light: :rotating_light: ) The Game _\`${objeto_anunciado.nome}\`_ it's free until the day \`${objeto_anunciado.expira}\` over there\n\nRedeem it as soon as possible to save \`R$"${objeto_anunciado.preco}\` and get a copy in your ${plataforma} account`
    }

    return texto_formatado
}