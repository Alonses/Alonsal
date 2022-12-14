const status = {
    0: ':octagonal_sign: | ',
    1: ':mag: | ',
    2: ':warning: | '
}

const { getUser } = require("../../adm/database/schemas/User.js")

const cache = {}

function reply(client, interaction, target, ephemeral, type) {

    let phrase = translate(client, interaction, target)

    if (typeof type !== "undefined")
        phrase = `${status[type]}${phrase}`

    interaction.reply({ content: phrase, ephemeral: ephemeral })
}

function editReply(client, interaction, target, type) {

    let phrase = translate(client, interaction, target)

    if (typeof type !== "undefined")
        phrase = `${status[type]}${phrase}`

    interaction.editReply({ content: phrase })
}

function phrase(client, interaction, target) {

    let phrase = translate(client, interaction, target)
    return phrase
}

function translate(client, interaction, target) {

    const default_lang = 'pt-br'
    // if (!cache[interaction.user.id]) {
    //     const user = await getUser(interaction.user.id)
    //     cache[user.uid]["lang"] = user.lang
    // }

    // Busca as traduções para o item solicitado
    let { data } = require(`../../arquivos/idiomas/${default_lang}.json`)

    try { // Buscando o item no idioma padrão (pt-br)
        if (!data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]])
            data = { data } = require(`../../arquivos/idiomas/pt-br.json`)
    } catch (err) {
        data = { data } = require(`../../arquivos/idiomas/pt-br.json`)
    }

    try {
        // Compactando a tradução alvo em um único valor
        if (!target.includes("minecraft.detalhes"))
            data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]]
        else
            data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]][target.split(".")[3]]
    } catch (err) { // Tradução não existente no idioma selecionado

        data = { data } = require(`../../arquivos/idiomas/pt-br.json`)
        data = data.data

        console.log(target, target.split("."))

        // Retornando a tradução em PT-BR (idioma padrão)
        if (!target.includes("minecraft.detalhes"))
            data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]]
        else
            data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]][target.split(".")[3]]
    }

    let phrase = data

    // Verifica se não há mensagens diferentes para o mesmo retorno
    if (Array.isArray(data))
        phrase = data[Math.floor((data.length - 1) * Math.random())]

    return phrase
}

module.exports = {
    reply,
    phrase,
    editReply,
    translate
}