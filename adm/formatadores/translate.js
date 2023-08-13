const { status } = require('../../arquivos/json/text/emojis.json')

function reply(interaction, user, target, ephemeral, type, replace) {

    let phrase = translate(user, target)
    phrase = check_emojis(phrase, type)

    if (replace) { // Substitui partes do texto por outros valores
        if (typeof replace === "object") { // Array com vários dados para alterar
            while (replace.length > 0) {
                phrase = phrase.replace("auto_repl", replace[0])
                replace.shift()
            }
        } else // Apenas um valor para substituição
            phrase = phrase.replaceAll("auto_repl", replace)
    }

    interaction.reply({
        content: phrase,
        ephemeral: ephemeral
    })
}

function editReply(interaction, user, target, ephemeral, type) {

    let phrase = translate(user, target)
    phrase = check_emojis(phrase, type)

    return interaction.editReply({
        content: phrase,
        ephemeral: ephemeral
    })
}

function phrase(user, target, type) {

    let phrase = translate(user, target)
    phrase = check_emojis(phrase, type)

    return phrase
}

function report(interaction, user, target, ephemeral, type, button) {

    let phrase = translate(user, target)
    phrase = check_emojis(phrase, type)

    if (button) // Valida se a interação partiu de um botão
        interaction.update({
            content: phrase,
            embeds: [],
            components: [],
            ephemeral: ephemeral
        })
    else
        interaction.reply({
            content: phrase,
            ephemeral: ephemeral
        })
}

function translate(alvo, target) {

    // Pode ser usado para referenciar usuários ou servidores
    const idioma_alvo = alvo.lang

    // Busca as traduções para o item solicitado
    let { data } = require(`../../arquivos/idiomas/${idioma_alvo}.json`)

    try { // Buscando o item no idioma padrão (pt-br)
        if (!data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]])
            data = { data } = require(`../../arquivos/idiomas/pt-br.json`)
    } catch {
        data = { data } = require(`../../arquivos/idiomas/pt-br.json`)
    }

    try {
        if (!target.includes("manu.data.selects")) {
            // Compactando a tradução alvo em um único valor
            if (!target.includes("minecraft.detalhes") && !target.includes("manu.data.causes"))
                data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]]
            else
                data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]][target.split(".")[3]]
        } else
            data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]][target.split(".")[3]][target.split(".")[4]]

    } catch { // Tradução não existente no idioma selecionado

        data = { data } = require(`../../arquivos/idiomas/pt-br.json`)
        data = data.data

        if (!target.includes("manu.data.selects")) {
            // Retornando a tradução em PT-BR (idioma padrão)
            if (!target.includes("minecraft.detalhes") && !target.includes("manu.data.causes"))
                data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]]
            else
                data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]][target.split(".")[3]]
        } else
            data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]][target.split(".")[3]][target.split(".")[4]]
    }

    let phrase = data

    // Verifica se não há mensagens diferentes para o mesmo retorno
    if (Array.isArray(data))
        phrase = data[Math.floor((data.length - 1) * Math.random())]

    return phrase
}

function check_emojis(phrase, type) {

    if (type)
        phrase = `${get_emoji(type)} | ${phrase}`

    return phrase
}

function get_emoji(valores) {

    let emoji = ""

    if (typeof valores === "object") { // Array de emojis
        if (valores[0].length < 8 || typeof valores[0] === "number")
            emoji = lista_emojis(valores)
        else // Emoji único
            if (valores.length < 8 && typeof valores === "number")
                emoji = status[valores]
    } else if (typeof valores === "number")
        emoji = status[valores] // Emoji por números de identificador
    else
        emoji = valores // Emojis já definidos

    return emoji
}

function lista_emojis(type) {

    const emojis = []

    type.forEach(emoji => {
        emojis.push(status[emoji])
    })

    return emojis.join(" ")
}

module.exports = {
    reply,
    phrase,
    report,
    editReply,
    translate,
    get_emoji
}