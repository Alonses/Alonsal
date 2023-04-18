const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { getUser } = require('../database/schemas/User.js')
const { getBot } = require('../database/schemas/Bot.js')

const { mkdirSync, writeFileSync, existsSync, readdirSync } = require('fs')

let default_lang

// Carrega todos os idiomas do bot diretamente do git
async function loadAll(client) {
    if (!existsSync(`./arquivos/idiomas/`))
        mkdirSync(`./arquivos/idiomas/`, { recursive: true })

    const bot = await getBot(client.id())

    fetch("https://github.com/Alonses/Alondioma")
        .then(response => response.text())
        .then(async res => {

            // Buscando o commit mais recente
            const cod_commit = res.split("<include-fragment src=\"/Alonses/Alondioma/spoofed_commit_check/")[1].split("\"")[0].slice(0, 7)

            if (cod_commit !== bot.persis.alondioma) {
                console.log("Sincronizando com os idiomas mais recentes.")

                if (process.env.channel_lang)
                    client.channels().get(process.env.channel_lang).send(`:sa: | Pacote de traduções do ${client.user().username} sincronizado com o commit \`${cod_commit}\``)
                else
                    console.log(`🈂️ | Pacote de traduções do ${client.user().username} sincronizado com o commit ${cod_commit}`)

                fetch("https://api.github.com/repos/Alonses/Alondioma/contents/")
                    .then(res => res.json())
                    .then(content => {
                        for (let i = 0; i < content.length; i++) {
                            const idioma = content[i]

                            if (!idioma.name.endsWith(".json")) continue

                            fetch(idioma.download_url)
                                .then(res => res.json())
                                .then(res => {
                                    writeFileSync(`./arquivos/idiomas/${idioma.name}`, JSON.stringify(res))
                                })
                        }
                    })
            }
        })
}

// Lista todas as bandeiras de idiomas carregados
function listAll() {
    const bandeiras = []
    let i = 0

    for (const file of readdirSync(`./arquivos/idiomas/`)) {

        let bandeira = file.slice(0, 5) !== "al-br" ? `:flag_${file.slice(3, 5)}:` : `:pirate_flag:`

        if (!bandeiras.includes(bandeira))
            bandeiras.push(bandeira)

        i++
    }

    return bandeiras.join(" ")
}

function setDefault(lang) {
    default_lang = lang
}

async function setLang(interaction, lang) {

    const id = interaction.user.id
    const user = await getUser(id)

    // Salvando os dados do usuário
    user.updateOne({ uid: id }, {
        lang: lang
    })
}

function getLang() {
    return default_lang
}

module.exports = {
    setDefault,
    setLang,
    getLang,
    loadAll,
    listAll
}