const { writeFileSync, readFileSync }  = require("fs");

let default_lang;
let datapath;

function setPath(path) {
    datapath = path;
}

function setDefault(lang) {
    default_lang = lang;
}

function setLang(guildId, lang) {
    writeFileSync(`${datapath}/${guildId}.txt`, lang);
}

function getLang(guildId) {
    try {
        return readFileSync(`${datapath}/${guildId}.txt`, "utf-8") || default_lang;
    }
    catch (e) {
        return default_lang;
    }
}

module.exports = {
    setPath,
    setDefault,
    setLang,
    getLang
}