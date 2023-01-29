module.exports = (stats_semana, stats_passado, hora, client, user) => {

    if (hora) { // Formatando a hora para números inteiros
        stats_semana = parseInt(stats_semana.split(" horas")[0])
        stats_passado = parseInt(stats_passado.split(" horas")[0])

        horas_tocadas = `${stats_semana}${client.tls.phrase(user, "util.unidades.horas")}`
        horas_passadas = `${stats_passado}${client.tls.phrase(user, "util.unidades.horas")}`
    }

    porcentagem = (100 * stats_semana) / stats_passado

    if (stats_semana < stats_passado)
        porcentagem = `🔽 ${(100 - porcentagem).toFixed(2)}`
    else
        porcentagem = `🔼 ${(porcentagem - 100).toFixed(2)}`

    return porcentagem
}