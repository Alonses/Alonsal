module.exports = (latitude, client, user) => {

    let data_atual = new Date()
    const emojis = ["🌻", "🍂", "❄️", "🌼"]
    let datas_estacao = ["21/12", "21/03", "21/06", "21/09"], comeco_termino = ""
    const estacao_nome = ["verao", "outono", "inverno", "primavera"]

    const dias_passados = calcula_dias(data_atual.getDate(), data_atual.getMonth() + 1, data_atual.getFullYear())

    // Estipulando um indice de clima
    let indice = estipula_indice(dias_passados, latitude)
    if (latitude > 0) // Hemisfério norte
        datas_estacao = ["21/06", "21/09", "21/12", "21/03"]

    let indice_int = indice + 1
    if (indice_int >= datas_estacao.length) indice_int = 0

    // Máximo de informações para o clima
    if (user.misc.weather || false)
        comeco_termino = `${client.tls.phrase(user, "util.tempo.comeco")} ${datas_estacao[indice]}${client.tls.phrase(user, "util.tempo.termino")} ${datas_estacao[indice_int]}`

    // Calculando o tempo restante em dias para o fim da estação
    mes_termino = parseInt(datas_estacao[indice_int].split("/")[1])
    dias_restantes = calcula_dias(21, mes_termino, data_atual.getFullYear()) - calcula_dias(data_atual.getDate(), data_atual.getMonth() + 1, data_atual.getFullYear())

    if (dias_restantes > 1) dias_restantes += `${client.tls.phrase(user, "util.unidades.dias")}`
    else dias_restantes += `${client.tls.phrase(user, "util.unidades.dia")}`

    estacao = `${emojis[indice]} ${client.tls.phrase(user, `util.tempo.${estacao_nome[indice]}`)}${client.tls.phrase(user, "util.tempo.termino")} ${dias_restantes}\n${comeco_termino}`

    return estacao
}

function calcula_dias(dia_atual, mes_atual, ano_atual) {

    let dias = 0, ult_mes = 0

    for (let x = 0; x < mes_atual; x++) {
        let diasNoMes = new Date(ano_atual, x + 1, 0).getDate()

        for (let i = 1; i <= diasNoMes; i++)
            dias++

        ult_mes = diasNoMes
    }

    return dias - (ult_mes - dia_atual)
}

function estipula_indice(dias_passados, latitude) {

    // Estipula um indice para a estação do local
    let indices = [1, 2, 3, 0]

    if (latitude > 0)
        indices = [3, 0, 1, 2]

    let indice = dias_passados > 79 && dias_passados <= 171 ? indices[0] : dias_passados > 171 && dias_passados <= 264 ? indices[1] : dias_passados > 264 && dias_passados <= 354 ? indices[2] : indices[3]

    return indice
}