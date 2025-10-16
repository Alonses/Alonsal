
module.exports = ({ data }) => {

    let entrada = data?.entrada || null
    const hora_entrada = data?.hora_entrada || null

    if (entrada || hora_entrada) { // Informou um dia e horário ( utilizado pelos anúncios de games )

        let tempo_timestamped

        // Invertendo o mês com o dia
        if (entrada.includes("/")) {
            entrada = `${entrada.split("/")[1]}/${entrada.split("/")[0]}`

            let hora = hora_entrada || ""

            const ano_atual = new Date().getFullYear()
            tempo_timestamped = new Date(`${entrada}/${ano_atual} ${hora}`)

            if (entrada.split("/")[0] < 2 && new Date().getMonth() >= 8)
                tempo_timestamped = new Date(`${entrada}/${ano_atual + 1}`)
        } else
            tempo_timestamped = new Date(entrada) // Entrada de string bruta com padrão utilizado pelo Discord

        // Retorna o dia e o horário informado em timestamp
        return Math.floor(tempo_timestamped.getTime() / 1000)
    }

    return Math.floor(new Date().getTime() / 1000)
}