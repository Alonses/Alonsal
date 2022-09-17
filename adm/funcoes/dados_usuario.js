const { existsSync, writeFileSync } = require("fs")

function getUser(id_alvo) {

    const user = {
        id: id_alvo,
        lang: 'pt-br',
        steam: null,
        lastfm: null,
        color: '0x29BB8E',
        money: 0,
        daily: null
    }

    if (existsSync(`./arquivos/data/user/${user.id}.json`)) {
        delete require.cache[require.resolve(`../../arquivos/data/user/${user.id}.json`)]
        const { lang, steam, lastfm, color, money, daily } = require(`../../arquivos/data/user/${user.id}.json`)

        user.lang = lang
        user.steam = steam
        user.lastfm = lastfm
        user.color = color || '0x29BB8E'
        user.money = money || 0
        user.daily = daily
    }

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