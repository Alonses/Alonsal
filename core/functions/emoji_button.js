function emoji_button(valor) {

    if (typeof valor !== "undefined" && valor !== null)
        if (valor) return valor === true ? "✅" : "❔"
        else return "⛔"

    return "✅"
}

function type_button(dado) {

    // Tipos de botões
    // true -> Ativado ( verde | 2 )
    // false -> Desativado ( cinza | 0 )

    if (typeof dado !== "undefined")
        if (dado) return 2
        else return 1

    return 2
}

module.exports = {
    emoji_button,
    type_button
}