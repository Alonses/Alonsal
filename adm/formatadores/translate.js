const status = {
    0: '🛑 | ',
    1: '🔍 | ',
    2: '⚠️ | ',
    3: '💂 | ',
    4: '💢 | ',
    5: '🐣 | ',
    6: '📣 | '
}

function reply(interaction, user, target, ephemeral, type) {

    let phrase = translate(user, target)

    if (typeof type !== "undefined")
        phrase = `${status[type]}${phrase}`

    interaction.reply({ content: phrase, ephemeral: ephemeral })
}

function editReply(interaction, user, target, ephemeral, type) {

    let phrase = translate(user, target)

    if (typeof type !== "undefined")
        phrase = `${status[type]}${phrase}`

    interaction.editReply({ content: phrase, ephemeral: ephemeral })
}

function phrase(user, target) {

    let phrase = translate(user, target)
    return phrase
}

function translate(user, target) {

    const idioma_user = user.lang

    // Busca as traduções para o item solicitado
    let { data } = require(`../../arquivos/idiomas/${idioma_user}.json`)

    try { // Buscando o item no idioma padrão (pt-br)
        if (!data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]])
            data = { data } = require(`../../arquivos/idiomas/pt-br.json`)
    } catch {
        data = { data } = require(`../../arquivos/idiomas/pt-br.json`)
    }

    try {
        // Compactando a tradução alvo em um único valor
        if (!target.includes("minecraft.detalhes"))
            data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]]
        else
            data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]][target.split(".")[3]]
    } catch { // Tradução não existente no idioma selecionado

        data = { data } = require(`../../arquivos/idiomas/pt-br.json`)
        data = data.data

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