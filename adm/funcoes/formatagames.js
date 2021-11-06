module.exports = (tipo_anun, item1, item2, data, valor_total, logo_plat, plataforma, canais_clientes, i, idioma) => {

    let texto_formatado;
    let nome_item_2 = "";
    let nome_item = item1.replaceAll("_", " ");

    if(typeof item2 !== "undefined")
        nome_item_2 = item2.replaceAll("_", " ");
    
    if(tipo_anun !== "dlc" && tipo_anun !== "u"){
        texto_formatado = `( ${logo_plat} ) O Game _\`${nome_item}\`_ está gratuito até o dia \`${data}\` por lá\n\nResgate ele antes da data para poupar \`R$${valor_total}\` e garantir uma cópia em sua conta ${plataforma}`;

        if(idioma === "en-us")
            texto_formatado = `( ${logo_plat} ) The Game _\`${nome_item}\`_ it's free until the day \`${data}\` over there\n\nRedeem it before date to save \`R$"${valor_total}\` and get a copy in your ${plataforma} account`;

        if(nome_item_2 !== ""){
            texto_formatado = `( ${logo_plat} ) Os Games _\`${nome_item}\`_ & _\`${nome_item_2}\`_ estão gratuitos até o dia \`${data}\` por lá\n\nResgate ambos antes da data para poupar \`R$${valor_total}\` e garantir uma cópia em sua conta ${plataforma}`;

            if(idioma === "en-us")
                texto_formatado = `( ${logo_plat} ) The Games _\`${nome_item}\`_ & _\`${nome_item_2}\`_ are free until the day \`"${data}\` over there\n\nRedeem both before date to save \`R$${valor_total}\` and get a copy in your ${plataforma} account`;
        }
    }else if(tipo_anun === "dlc"){
        texto_formatado = `( ${logo_plat} ) A DLC _\`${nome_item}\`_ esta gratuita até o dia \`${data}\` por lá\n\nResgate ela antes da data para poupar \`R$${valor_total}\` e garantir uma cópia em sua conta ${plataforma}`;

        if(idioma === "en-us")
            texto_formatado = `( ${logo_plat} ) The DLC _\`${nome_item}\`_ it's free until the day \`${data}\` over there\n\nRedeem it before date to save \`R$"${valor_total}\` and get a copy in your ${plataforma} account`;

        if(nome_item_2 !== ""){
            texto_formatado = `( ${logo_plat} ) As DLC's _\`${nome_item}\`_ & _\`${nome_item_2}\`_ estão gratuitas até o dia \`${data}\` por lá\n\nResgate ambas antes da data para poupar \`R$${valor_total}\` e garantir uma cópia em sua conta ${plataforma}`;

            if(idioma === "en-us")
                texto_formatado = `( ${logo_plat} ) The DLC's _\`${nome_item}\`_ & _\`${nome_item_2}\`_ are free until the day \`"${data}\` over there\n\nRedeem both before date to save \`R$${valor_total}\` and get a copy in your ${plataforma} account`;
        }
    }else if(tipo_anun === "u"){
        texto_formatado = `( ${logo_plat} | :rotating_light: :rotating_light: :rotating_light: ) O Game _\`${nome_item}\`_ está gratuito até o dia \`${data}\` por lá\n\nResgate ele o quanto antes para poupar \`R$${valor_total}\` e garantir uma cópia em sua conta ${plataforma}`;

        if(idioma === "en-us")
            texto_formatado = `( ${logo_plat} | :rotating_light: :rotating_light: :rotating_light: ) The Game _\`${nome_item}\`_ it's free until the day \`${data}\` over there\n\nRedeem it as soon as possible to save \`R$"${valor_total}\` and get a copy in your ${plataforma} account`;

        if(nome_item_2 !== ""){
            texto_formatado = `( ${logo_plat} | :rotating_light: :rotating_light: :rotating_light: ) Os Games _\`${nome_item}\`_ & _\`${nome_item_2}\`_ estão gratuitos até o dia \`${data}\` por lá\n\nResgate ambos o quanto antes para poupar \`R$${valor_total}\` e garantir uma cópia em sua conta ${plataforma}`;

            if(idioma === "en-us")
                texto_formatado = `( ${logo_plat} | :rotating_light: :rotating_light: :rotating_light: ) The Games _\`${nome_item}\`_ & _\`${nome_item_2}\`_ are free until the day \`"${data}\` over there\n\nRedeem both as soon as possible to save \`R$${valor_total}\` and get a copy in your ${plataforma} account`;
        }
    }

    return texto_formatado;
}