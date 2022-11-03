const { existsSync, writeFileSync, readdirSync } = require("fs")

function getUser(id_alvo) {

    const user = {
        id: id_alvo,
        lang: 'pt-br',
        social: {
            steam: null,
            lastfm: null,
            pula_predios: null
        },
        misc: {
            color: '0x29BB8E',
            money: 0,
            daily: null,
            embed: null
        },
        badges: {
            fixed_badge: null,
            badge_list: []
        },
        conquistas: []
    }

    if (existsSync(`./arquivos/data/user/${user.id}.json`)) {
        delete require.cache[require.resolve(`../../arquivos/data/user/${user.id}.json`)]
        const { lang, social, misc, badges, conquistas } = require(`../../arquivos/data/user/${user.id}.json`)

        user.lang = lang
        user.social = social
        user.misc = misc
        user.badges = badges
        user.conquistas = conquistas || []
    }

    if (user.misc.color == "RANDOM")
        user.misc.embed = alea_hex()

    return user
}

function saveUser(user) {

    for (let i = 0; i < user.length; i++) {
        const user_alvo = user[i]

        writeFileSync(`./arquivos/data/user/${user_alvo.id}.json`, JSON.stringify(user_alvo))
        delete require.cache[require.resolve(`../../arquivos/data/user/${user_alvo.id}.json`)]
    }
}

function updateData() {
    for (const file of readdirSync(`./arquivos/data/user/`)) {
        const { steam, money, color, id, fixed_badge, badge_list, daily, lastfm, pula_predios, lang, conquistas } = require(`../../arquivos/data/user/${file}`)

        const user = {
            id: id,
            lang: lang,
            social: {
                lastfm: lastfm || null,
                steam: steam || null,
                pula_predios: pula_predios || null
            },
            misc: {
                color: color || '0x29BB8E',
                money: money || 0,
                daily: daily || null,
                embed: null
            },
            badges: {
                fixed_badge: fixed_badge || null,
                badge_list: badge_list || []
            },
            conquistas: conquistas || []
        }

        // Salvando o usuário no novo formato
        saveUser([user])
    }
}

module.exports = {
    getUser,
    saveUser,
    updateData
}

function componentToHex(c) {
    var hex = c.toString(16)
    return hex.length == 1 ? `0${hex}` : hex
}

function rgbToHex(r, g, b) { return `0x${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}` }

function alea_hex() { return rgbToHex(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)) }