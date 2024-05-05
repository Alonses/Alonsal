const { status } = require('../../files/json/text/emojis.json')
const replace_string = require('../functions/replace_string')

function reply(interaction, user, target, ephemeral, emoji, replace) {

    let phrase = translate(user, target, replace)

    if (!user.conf.resumed) // Ignora os emojis do inicio das frases
        phrase = check_emojis(phrase, emoji)

    interaction.reply({
        content: phrase,
        ephemeral: ephemeral
    })
}

function editReply(interaction, user, target, ephemeral, emoji) {

    let phrase = translate(user, target)

    if (!user.conf.resumed) // Ignora os emojis do inicio das frases
        phrase = check_emojis(phrase, emoji)

    return interaction.editReply({
        content: phrase,
        ephemeral: ephemeral
    })
}

function phrase(user, target, emoji, replace) {

    // User é utilizado para definir o idioma de retorno
    // Target é a chave de tradução
    // Emoji é um valor para emoji, anexado com um | no inicio da frase traduzida
    // Replace é um valor para ser inserido no meio da frase

    let phrase = translate(user, target, replace)

    if (!user?.conf?.resumed) // Ignora os emojis do inicio das frases
        phrase = check_emojis(phrase, emoji)

    return phrase
}

function report(interaction, user, target, ephemeral, emoji, button, update) {

    let phrase = translate(user, target)

    if (!user.conf.resumed) // Ignora os emojis do inicio das frases
        phrase = check_emojis(phrase, emoji)

    if (button) // Valida se a interação partiu de um botão
        interaction.update({
            content: phrase,
            embeds: [],
            components: [],
            ephemeral: ephemeral
        })
    else if (update)
        interaction.update({
            content: phrase,
            ephemeral: ephemeral
        })
    else
        interaction.reply({
            content: phrase,
            ephemeral: ephemeral
        })
}

function translate(alvo, target, replace) {

    // Pode ser usado para referenciar usuários ou servidores
    const idioma_alvo = alvo.lang || "pt-br"
    let phrase

    // Busca as traduções para o item solicitado
    let { data } = require(`../../files/languages/${idioma_alvo}.json`)

    try { // Buscando o item no idioma padrão (pt-br)
        if (!data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]])
            data = { data } = require(`../../files/languages/pt-br.json`)
    } catch {
        data = { data } = require(`../../files/languages/pt-br.json`)
    }

    try {
        if (!target.includes("manu.data.selects")) {
            // Compactando a tradução alvo em um único valor
            if (!target.includes("minecraft.detalhes") && !target.includes("manu.data.causes") && !target.includes("mode.idiomas.siglas"))
                data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]]
            else
                data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]][target.split(".")[3]]
        } else
            data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]][target.split(".")[3]][target.split(".")[4]]

    } catch { // Tradução não existente no idioma selecionado

        try {
            data = { data } = require(`../../files/languages/pt-br.json`)
            data = data.data

            if (!target.includes("manu.data.selects")) {
                // Retornando a tradução em PT-BR (idioma padrão)
                if (!target.includes("minecraft.detalhes") && !target.includes("manu.data.causes") && !target.includes("mode.idiomas.siglas"))
                    data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]]
                else
                    data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]][target.split(".")[3]]
            } else
                data = data[target.split(".")[0]][target.split(".")[1]][target.split(".")[2]][target.split(".")[3]][target.split(".")[4]]
        } catch {

            // Utilizado apenas caso a tradução não exista no idioma padrão
            phrase = "<unknow_key>"
        }
    }

    if (data && !phrase) // Tradução encontrada
        phrase = data

    if (Array.isArray(data)) // Verifica se não há mensagens diferentes para o mesmo retorno
        phrase = data[Math.floor((data.length - 1) * Math.random())]

    if (alvo.misc?.second_lang) // Corrigindo a tradução para o idioma secundário ativo
        phrase = ajusta_traducao(alvo.misc.second_lang, phrase)

    if (phrase && phrase.includes("auto_repl")) // Substitui automaticamente os valores caso haja replaces inclusos na string
        phrase = replace_string(phrase, replace)

    return phrase || "<translated_text>"
}

function get_emoji(valores) {

    let emoji = ""

    if (typeof valores === "object") { // Array de emojis
        if (valores[0].length < 18 || typeof valores[0] === "number") emoji = lista_emojis(valores)
        else if (valores.length < 18 && typeof valores === "number") emoji = status[valores] // Emoji único
    } else if (!isNaN(parseInt(valores))) emoji = status[valores] // Emoji por números de identificador
    else emoji = valores // Emojis já definidos

    return emoji
}

check_emojis = (phrase, emoji) => {

    if (emoji) phrase = `${get_emoji(emoji)} | ${phrase}`

    return phrase
}

lista_emojis = (emojis_lista) => {

    const emojis = []
    emojis_lista.forEach(emoji => { emojis.push(status[emoji]) })

    return emojis.join(" ")
}


ajusta_traducao = (idioma, frase) => {

    let blocos = frase.split(" ")

    // Busca as traduções para o item solicitado
    let { data } = require(`../../files/languages/${idioma}.json`)

    for (let i = 0; i < blocos.length; i++) {

        // Altera o trecho para a tradução
        if (data[blocos[i]]) blocos[i] = data[blocos[i]]
    }

    return blocos.join(" ")
}

module.exports = {
    reply,
    phrase,
    report,
    editReply,
    translate,
    get_emoji
}