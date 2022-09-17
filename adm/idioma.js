const { writeFileSync, existsSync } = require("fs")

let default_lang, datapath

function setPath(path) {
    datapath = path
}

function setDefault(lang) {
    default_lang = lang
}

function setLang(interaction, lang) {

    const user = {
        id: interaction.user.id,
        lang: lang,
        steam: null,
        lastfm: null
    }

    if (existsSync(`./arquivos/data/user/${user.id}.json`)) {
        delete require.cache[require.resolve(`../arquivos/data/user/${user.id}.json`)]
        const { steam, lastfm } = require(`../arquivos/data/user/${user.id}.json`)

        user.steam = steam
        user.lastfm = lastfm
    }

    // Salvando os dados do usuário
    writeFileSync(`./arquivos/data/user/${user.id}.json`, JSON.stringify(user))
    delete require.cache[require.resolve(`../arquivos/data/user/${user.id}.json`)]
}

function getLang(elemento) {

    const idiomas = ["pt-br", "es-es", "fr", "en-us"]
    
    // Buscando o idioma usado pelo user
    const user = {
        id: elemento.user.id,
        lang: null
    }

    if (existsSync(`./arquivos/data/user/${user.id}.json`)) {
        delete require.cache[require.resolve(`../arquivos/data/user/${user.id}.json`)]
        const { lang } = require(`../arquivos/data/user/${user.id}.json`)

        if (!lang)
            if(idiomas.includes((elemento.locale).toLowerCase()))
                return elemento.locale.toLowerCase()
            else default_lang
        else
            return lang
    }
}

module.exports = {
    setPath,
    setDefault,
    setLang,
    getLang
}