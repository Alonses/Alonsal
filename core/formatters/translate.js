const { status } = require('../../files/json/text/emojis.json')

const replace_string = require('../functions/replace_string')

let traducoes, idioma_ativo

function reply(interaction, user, target, ephemeral, emoji, replace) {

    let phrase = translate(user, target, replace)
    if (ephemeral) ephemeral = "Ephemeral"

    if (!user.conf.resumed) // Ignora os emojis do inicio das frases
        phrase = check_emojis(phrase, emoji)

    interaction.reply({ content: phrase, flags: ephemeral })
}

function editReply(interaction, user, target, ephemeral, emoji) {

    let phrase = translate(user, target)

    if (!user.conf.resumed) // Ignora os emojis do inicio das frases
        phrase = check_emojis(phrase, emoji)

    let obj = { content: phrase }

    if (ephemeral) obj.flags = "Ephemeral"

    return interaction.editReply(obj)
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
    if (ephemeral) ephemeral = "Ephemeral"

    if (!user.conf.resumed) // Ignora os emojis do inicio das frases
        phrase = check_emojis(phrase, emoji)

    if (button) // Valida se a interação partiu de um botão
        interaction.update({
            content: phrase,
            embeds: [],
            components: [],
            flags: ephemeral
        })
    else if (update)
        interaction.update({
            content: phrase,
            flags: ephemeral
        })
    else
        interaction.reply({
            content: phrase,
            flags: ephemeral
        })
}

function translate(alvo, target, replace) {

    // Pode ser usado para referenciar usuários ou servidores
    let idioma_alvo = alvo.lang || "pt-br", data

    if (!traducoes || idioma_alvo !== idioma_ativo) { // Busca as traduções para o idioma solicitado
        ({ data } = require(`../../files/languages/${idioma_alvo}.json`))

        traducoes = data
        idioma_ativo = idioma_alvo
    }

    let phrase = traducoes
    const caminho = target.split(".")

    do {
        if (!phrase) { // Tradução não existe no idioma escolhido, usando idioma padrão
            ({ data } = require(`../../files/languages/pt-br.json`))

            phrase = data
            idioma_alvo = "pt-br"
        }

        try {
            for (let i = 0; i < caminho.length; i++)
                phrase = phrase[caminho[i]]
        } catch {
            // Chave desconhecida no idioma
            phrase = null
        }

        if (idioma_alvo === "pt-br" && !phrase)
            phrase = "<unknow_key>"

    } while (!phrase)

    if (Array.isArray(phrase)) // Verifica se não há mensagens diferentes para o mesmo retorno
        phrase = phrase[Math.floor((phrase.length - 1) * Math.random())]

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