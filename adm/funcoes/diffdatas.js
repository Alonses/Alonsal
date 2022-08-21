module.exports = (date1, date2, utilitarios) => {

    const now = new Date(date2) // Data de hoje
    const past = new Date(date1) // Outra data no passado
    const timediff = Math.abs(now.getTime() - past.getTime()) // Subtrai uma data pela outra

    const diferencas = []
    const diferenca_datas = new Date(timediff)
    
    diferencas.push(diferenca_datas.getYear()) // Ano 0
    diferencas.push(diferenca_datas.getMonth()) // Mes 1
    diferencas.push(diferenca_datas.getDate()) // Dia 2
    diferencas.push(diferenca_datas.getHours()) // Hora 3
    diferencas.push(diferenca_datas.getMinutes()) // Minuto 4
    diferencas.push(diferenca_datas.getSeconds()) // Segundo 5

    diferencas[0] = diferencas[0] - 70

    let retorno_ajustado, retorno = ""

    if(diferencas[0] > 1)
        retorno = `${diferencas[0]}${utilitarios[14]["anos"]}`
    else if(diferencas[0] > 0)
        retorno = `1${utilitarios[14]["ano"]}`

    if(diferencas[1] > 1)
        retorno += ` ${diferencas[1]}${utilitarios[14]["meses"]}`
    else if(diferencas[1] > 0)
        retorno += ` ${diferencas[1]}${utilitarios[14]["mes"]}`

    if(diferencas[2] > 1)
        retorno += ` ${diferencas[2]}${utilitarios[14]["dias"]}`
    else if(diferencas[2] === 1)
        retorno += ` ${diferencas[2]}${utilitarios[14]["dia"]}`

    if(diferencas[3] > 1 && diferencas[0] < 1)
        retorno += ` ${diferencas[3]}${utilitarios[14]["horas"]}`
    else if(diferencas[3] > 0 && diferencas[0] < 1)
        retorno += ` ${diferencas[3]}${utilitarios[14]["hora"]}`

    if(diferencas[4] > 1 && diferencas[1] === 0)
        retorno += ` ${diferencas[4]}${utilitarios[14]["minutos"]}`
    else if(diferencas[4] > 0 && diferencas[1] === 0)
        retorno += ` ${diferencas[4]}${utilitarios[14]["minuto"]}`

    if(diferencas[5] > 1 && diferencas[3] < 24 && diferencas[2] < 1)
        retorno += ` ${diferencas[5]}${utilitarios[14]["segundos"]}`
    else if(diferencas[5] > 0 && diferencas[3] < 24 && diferencas[2] < 1)
        retorno += ` ${diferencas[5]}${utilitarios[14]["segundo"]}`

    retorno_ajustado = retorno.split(" ")

    if(retorno_ajustado[0] === "")
        retorno_ajustado.shift()

    retorno_ajustado[1] = retorno_ajustado[1] +","
    retorno_ajustado.splice(4, 0, utilitarios[14]["e"])
    retorno_ajustado = retorno_ajustado.join(" ")

    return retorno_ajustado
}