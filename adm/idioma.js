const { writeFileSync, readFileSync } = require("fs")

let default_lang, datapath

function setPath(path) {
    datapath = path
}

function setDefault(lang) {
    default_lang = lang
}

function setLang(alvoID, lang) {
    writeFileSync(`${datapath}/${alvoID}.txt`, lang)
}

function getLang(elemento) {

    let alvoID = elemento.guild.id

    try {
        return readFileSync(`${datapath}/${alvoID}.txt`, "utf-8") || default_lang
    } catch (e) {
        return default_lang
    }
}

module.exports = {
    setPath,
    setDefault,
    setLang,
    getLang
}