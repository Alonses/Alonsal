module.exports = (entrada, saida) => {

    if (entrada == null || saida == null) return 0

    let data = new Date()
    let dia = String(data.getDate()).padStart(2, '0')
    let mes = String(data.getMonth() + 1).padStart(2, '0')
    let ano = data.getFullYear()

    let inicio = new Date(ano, mes - 1, dia, entrada.substr(0, 2), entrada.substr(3, 2))
    let diff

    if (entrada < saida) {
        let fim = new Date(ano, mes - 1, dia, saida.substr(0, 2), saida.substr(3, 2))

        diff = Math.abs(inicio.getTime() - fim.getTime())
    } else {
        let fim = new Date(ano, mes - 1, dia, saida.substr(0, 2), saida.substr(3, 2))

        fim.setDate(fim.getDate() + 1)
        diff = Math.abs(inicio.getTime() - fim.getTime())
    }

    return diff
}