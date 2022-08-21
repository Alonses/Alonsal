module.exports = (entrada, saida) => {

    let hora_inicio = entrada
    let hora_fim = saida

    if(entrada == null || saida == null ) return 0

    let data = new Date()
    let dia = String(data.getDate()).padStart(2, '0')
    let mes = String(data.getMonth() + 1).padStart(2, '0') //January is 0!
    let ano = data.getFullYear()

    let inicio = new Date(ano, mes - 1, dia, hora_inicio.substr(0, 2), hora_inicio.substr(3, 2))
    let diff

    if (hora_inicio < hora_fim) {
        let fim = new Date(ano, mes - 1, dia, hora_fim.substr(0, 2), hora_fim.substr(3, 2))

        diff = Math.abs(inicio.getTime() - fim.getTime())
    }else{
        let fim = new Date(ano, mes - 1, dia, hora_fim.substr(0, 2), hora_fim.substr(3, 2))

        fim.setDate(fim.getDate() + 1)
        diff = Math.abs(inicio.getTime() - fim.getTime())
    }

    return diff
}