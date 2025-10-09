module.exports = async ({ client, alvo, internal_module }) => {

    let idioma_definido = alvo.lang ?? "pt-br"
    if (idioma_definido === "al-br") idioma_definido = "pt-br"

    let horario = new Date(), frase
    horario = horario.getHours()

    if (horario > 6 && horario < 12) // Manhã
        frase = client.tls.phrase(alvo, "modu.frases.manha")
    else if (horario > 12 && horario < 18) // Tarde
        frase = client.tls.phrase(alvo, "modu.frases.tarde")
    else
        frase = client.tls.phrase(alvo, "modu.frases.noite")

    client.sendModule(alvo, { content: frase }, internal_module)
}