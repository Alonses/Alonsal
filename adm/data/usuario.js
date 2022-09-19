const { existsSync, writeFileSync } = require("fs")

function getUser(id_alvo) {

    const user = {
        id: id_alvo,
        lang: 'pt-br',
        steam: null,
        lastfm: null,
        color: '0x29BB8E',
        money: 0,
        daily: null,
        fixed_badge: null,
        badge_list: []
    }

    if (existsSync(`./arquivos/data/user/${user.id}.json`)) {
        delete require.cache[require.resolve(`../../arquivos/data/user/${user.id}.json`)]
        const { lang, steam, lastfm, color, money, daily, fixed_badge, badge_list } = require(`../../arquivos/data/user/${user.id}.json`)

        user.lang = lang
        user.steam = steam
        user.lastfm = lastfm
        user.color = color || '0x29BB8E'
        user.money = money || 0
        user.daily = daily
        user.fixed_badge = fixed_badge
        user.badge_list = badge_list
    }

    if (user.color == "RANDOM")
        user.color = alea_hex()

    return user
}

function saveUser(user) {
    writeFileSync(`./arquivos/data/user/${user.id}.json`, JSON.stringify(user))
    delete require.cache[require.resolve(`../../arquivos/data/user/${user.id}.json`)]
}

module.exports = {
    getUser,
    saveUser
}

function componentToHex(c) {
    var hex = c.toString(16)
    return hex.length == 1 ? `0${hex}` : hex
}

function rgbToHex(r, g, b) { return `0x${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}` }

function alea_hex(){ return rgbToHex(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)) }