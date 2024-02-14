module.exports = (entrada, hora_entrada) => {

    // Invertendo o mês com o dia
    entrada = `${entrada.split("/")[1]}/${entrada.split("/")[0]}`
    let hora = hora_entrada || ""

    const ano_atual = new Date().getFullYear()
    let tempo_timestamped = new Date(`${entrada}/${ano_atual} ${hora}`)

    if (entrada.split("/")[0] < 2 && new Date().getMonth() >= 8)
        tempo_timestamped = new Date(`${entrada}/${ano_atual + 1}`)

    return tempo_timestamped.getTime() / 1000
}