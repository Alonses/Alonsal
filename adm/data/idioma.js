const { writeFileSync, existsSync } = require("fs")

let default_lang, datapath

function setPath(path) {
    datapath = path
}

function setDefault(lang) {
    default_lang = lang
}

function setLang(client, interaction, lang) {

    const user = client.usuarios.getUser(interaction.user.id)
    user.lang = lang
    
    // Salvando os dados do usuário
    writeFileSync(`./arquivos/data/user/${user.id}.json`, JSON.stringify(user))
    delete require.cache[require.resolve(`../../arquivos/data/user/${user.id}.json`)]
}

function getLang(elemento) {

    const idiomas = ["pt-br", "es-es", "fr", "en-us"]

    let id_user = elemento

    if (isNaN(parseInt(elemento)))
        id_user = elemento.user.id

    if (existsSync(`./arquivos/data/user/${id_user}.json`)) {
        delete require.cache[require.resolve(`../../arquivos/data/user/${id_user}.json`)]
        const { lang } = require(`../../arquivos/data/user/${id_user}.json`)

        if (!lang)
            if (idiomas.includes((elemento.locale).toLowerCase()))
                return elemento.locale.toLowerCase()
            else default_lang
        else
            return lang
    } else
        return default_lang
}

module.exports = {
    setPath,
    setDefault,
    setLang,
    getLang
}