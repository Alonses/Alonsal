const status = {
    0: ':octagonal_sign: | ',
    1: ':mag: | ',
    2: ':warning: | '
}

function reply(client, interaction, target, ephemeral, type) {

    let phrase = translate(client, interaction, target)

    if (typeof type !== "undefined")
        phrase = `${status[type]}${phrase}`

    interaction.reply({ content: phrase, ephemeral: ephemeral })
}

function editReply(client, interaction, target, ephemeral, type) {

    let phrase = translate(client, interaction, target)

    if (typeof type !== "undefined")
        phrase = `${status[type]}${phrase}`

    interaction.editReply({ content: phrase, ephemeral: ephemeral })
}

function phrase(client, interaction, target) {

    let phrase = translate(client, interaction, target)
    return phrase
}

function translate(client, interaction, target) {

    // Busca as traduções para o item solicitado
    let { data } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

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