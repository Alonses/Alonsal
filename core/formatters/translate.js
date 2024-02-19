const { status } = require('../../files/json/text/emojis.json')

const languagesMap = {
    "al": ["al-br", ":pirate_flag: | Meu idioma agora é o `Alonsês`", "Alonsês", "🏴‍☠️"],
    "de": ["de-de", ":flag_de: | Die Sprache wurde auf `Deutsch` geändert", "Deutsch", "🇩🇪"],
    "en": ["en-us", ":flag_us: | Language switched to `American English`", "American English", "🇺🇸"],
    "es": ["es-es", ":flag_es: | Idioma cambiado a `Español`", "Español", "🇪🇸"],
    "fr": ["fr-fr", ":flag_fr: | Langue changée en `Français`", "Français", "🇫🇷"],
    "hp": ["pt-hp", ":sunny: | \`Hopês\` agora tá ativo komo segundino idioma!", "Hopês", "🔆"],
    "it": ["it-it", ":flag_it: | Lingua cambiata in `Italiano`", "Italiano", "🇮🇹"],
    "pt": ["pt-br", ":flag_br: | Idioma alterado para `Português Brasileiro`", "Português Brasileiro", "🇧🇷"],
    "ru": ["ru-ru", ":flag_ru: | Язык изменен на `русский`", "русский", "🇷🇺"]
}

function reply(interaction, user, target, ephemeral, type, replace) {

    let phrase = translate(user, target)

    if (!user.conf.resumed) // Ignora os emojis do inicio das frases
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

    if (!user.conf.resumed) // Ignora os emojis do inicio das frases
        phrase = check_emojis(phrase, type)

    return interaction.editReply({
        content: phrase,
        ephemeral: ephemeral
    })
}

function phrase(user, target, type) {

    // User é utilizado para definir o idioma de retorno
    // Target é a chave de tradução
    // Type é um valor para emoji, anexado com | no inicio da tradução

    let phrase = translate(user, target)

    if (!user.conf.resumed) // Ignora os emojis do inicio das frases
        phrase = check_emojis(phrase, type)

    return phrase
}

function report(interaction, user, target, ephemeral, type, button, update) {

    let phrase = translate(user, target)

    if (!user.conf.resumed) // Ignora os emojis do inicio das frases
        phrase = check_emojis(phrase, type)

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

function translate(alvo, target) {

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

    if (alvo.misc.second_lang) // Corrigindo a tradução para o idioma secundário ativo
        phrase = ajusta_traducao(alvo.misc.second_lang, phrase)

    return phrase || "<translated_text>"
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

check_emojis = (phrase, type) => {

    if (type)
        phrase = `${get_emoji(type)} | ${phrase}`

    return phrase
}

lista_emojis = (type) => {

    const emojis = []

    type.forEach(emoji => {
        emojis.push(status[emoji])
    })

    return emojis.join(" ")
}


ajusta_traducao = (idioma, frase) => {

    let blocos = frase.split(" ")

    // Busca as traduções para o item solicitado
    let { data } = require(`../../files/languages/${idioma}.json`)

    for (let i = 0; i < blocos.length; i++) {

        if (data[blocos[i]]) // Altera o trecho para a tradução
            blocos[i] = data[blocos[i]]
    }

    return blocos.join(" ")
}

module.exports = {
    reply,
    phrase,
    report,
    editReply,
    translate,
    get_emoji,
    languagesMap
}