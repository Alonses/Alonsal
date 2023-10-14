function emoji_button(valor) {

    let retorno = "✅"

    if (typeof valor !== "undefined" && valor !== null)
        if (valor)
            retorno = valor === true ? "✅" : "❔"
        else
            retorno = "⛔"

    return retorno
}

function type_button(dado) {

    // Tipos de botões
    // true -> Ativado ( verde | 2 )
    // false -> Desativado ( cinza | 0 )

    let retorno = 2

    if (typeof dado !== "undefined" && dado !== null)
        if (dado)
            retorno = 2
        else
            retorno = 1

    return retorno
}

module.exports = {
    emoji_button,
    type_button
}