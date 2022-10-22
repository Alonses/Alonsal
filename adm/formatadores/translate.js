const status = {
    0: ':octagonal_sign: | ',
    1: ':mag: | ',
    2: ':warning: | '
}

function reply(interaction, target, ephemeral, tipo) {

    let phrase = translate(interaction, target)

    if (typeof tipo !== "undefined")
        phrase = `${status[tipo]}${phrase}`

    interaction.reply({ content: phrase, ephemeral: ephemeral })
}

function editReply(interaction, target, ephemeral, tipo) {

    let phrase = translate(interaction, target)

    if (typeof tipo !== "undefined")
        phrase = `${status[tipo]}${phrase}`

    interaction.editReply({ content: phrase, ephemeral: ephemeral })
}

function phrase(interaction, target) {

    let phrase = translate(interaction, target)
    return phrase
}

function translate(interaction, target) {

    // Busca as traduções para o item solicitado
    const lang = this.client.idioma.getLang(interaction)
    let { data } = require(`../../arquivos/idiomas/${lang}.json`)

    try { // Buscando o item no idioma padrão (pt-br)
        if (!data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]])
            data = { data } = require(`../../arquivos/idiomas/pt-br.json`)
    } catch (err) {
        data = { data } = require(`../../arquivos/idiomas/pt-br.json`)
    }

    // Compactando a tradução alvo em um único valor
    data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]]
    let phrase = data

    // Verifica se não há mensagens diferentes para o mesmo retorno
    if (Array.isArray(data))
        phrase = data[Math.floor((data.length - 1) * Math.random())]

    return phrase
}

module.exports = {
    reply,
    phrase,
    editReply
}