module.exports = (valor) => {

    let retorno = "✅"

    if (typeof valor !== "undefined" && valor !== null)
        if (valor)
            retorno = "✅"
        else
            retorno = "⛔"

    return retorno
}