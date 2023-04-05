module.exports = async ({ client }) => {

    if (!client.x.modules) return

    const date1 = new Date() // Trava o cronometro em um intervalo de 60 segundos
    const tempo_restante = (60 - date1.getSeconds()) * 1000

    console.log(`Disparando modulos em ${tempo_restante / 1000} segundos`)

    setTimeout(() => {
        requisita_modulo()
        verifica_modulo(client, 60000)
    }, tempo_restante) // Executa de 60 em 60 segundos
}

function verifica_modulo(client, tempo_restante) {

    setTimeout(() => {
        requisita_modulo()
        verifica_modulo(client, 60000)
    }, tempo_restante)
}

function requisita_modulo() {
    console.log("Disparando modulos")
}