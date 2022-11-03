const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { mkdirSync, writeFileSync, existsSync, readdirSync } = require("fs")
const fs = require('fs')

let default_lang, datapath

// Carrega todos os idiomas do bot diretamente do git
function loadAll() {

    const idiomas = process.env.language.split(", ")

    if (!existsSync(`./arquivos/idiomas/`))
        mkdirSync(`./arquivos/idiomas/`, { recursive: true })


    fetch(`https://github.com/Alonses/Alondioma`)
        .then(res => res.text())
        .then(res => {

            // Verifica o commit mais recente
            const commit = res.split("<include-fragment src=\"/Alonses/Alondioma/spoofed_commit_check/")[1].split("\"")[0].slice(0, 7)

            fs.readFile('./arquivos/data/language.txt', 'utf8', function (err, data) {

                if (commit !== data) {
                    for (let i = 0; i < idiomas.length; i++) {
                        fetch(`https://raw.githubusercontent.com/Alonses/Alondioma/main/${idiomas[i]}.json`)
                            .then(res => res.json())
                            .then(res => {
                                writeFileSync(`./arquivos/idiomas/${idiomas[i]}.json`, JSON.stringify(res))
                            })
                    }

                    console.log("Sincronizando com os idiomas mais recentes")
                }

                fs.writeFile('./arquivos/data/language.txt', commit, (err) => {
                    if (err) throw err
                })
            })
        })
}

// Lista todas as bandeiras de idiomas carregados
function listAll() {
    const bandeiras = []
    let i = 0

    for (const file of readdirSync(`./arquivos/idiomas/`)) {

        if (i % 3 == 0)
            bandeiras.push("\n")

        let bandeira = file.slice(0, 5) !== "al-br" ? `:flag_${file.slice(3, 5)}:` : `:pirate_flag:`

        if (!bandeiras.includes(bandeira))
            bandeiras.push(bandeira)

        i++
    }

    return bandeiras.join(" ")
}

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

    const idiomas = ["pt-br", "es-es", "fr-fr", "en-us", "it-it"]

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
    getLang,
    loadAll,
    listAll
}