const mongoose = require("mongoose")

const colorsMap = {
    "red": ["D62D20", 1, "🎈"],
    "brown": ["66401D", 1, "🐶"],
    "orange": ["F27D0C", 1, "🎃"],
    "yellow": ["FFD319", 1, "🎁"],
    "green": ["36802D", 1, "🎄"],
    "blue": ["7289DA", 1, "💎"],
    "cyan": ["29BB8E", 1, "🧪"],
    "purple": ["44008B", 1, "🔮"],
    "magenta": ["FF2EF1", 1, "🌸"],
    "white": ["FFFFFF", 2, "🧻"],
    "gray": ["2D2D31", 2, "🛒"],
    "black": ["000000", 2, "🎮"],
    "random": ["random", 3, "💥"]
}

const colorsPriceMap = {
    0: 200,
    1: 300,
    2: 400,
    3: 500,
    4: 50
}

const defaultUserEraser = {
    1: 2419200,  // 1 mês
    2: 7257600,  // 3 meses
    3: 14515200, // 6 meses
    4: 29030400  // 1 ano
}

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    lang: { type: String, default: null },
    erase: {
        erase_on: { type: Number, default: null },
        valid: { type: Boolean, default: false },
        forced: { type: Boolean, defaul: false },
        timeout: { type: Number, default: 2 },
        guild_timeout: { type: Number, default: 2 }
    },
    social: {
        steam: { type: String, default: null },
        lastfm: { type: String, default: null },
        pula_predios: { type: String, default: null }
    },
    profile: {
        avatar: { type: String, default: null },
        about: { type: String, default: null },
        join: { type: Boolean, default: true },
        creation: { type: Boolean, default: true },
        bank: { type: Boolean, default: true },
        lastfm: { type: Boolean, default: false },
        steam: { type: Boolean, default: false },
        thumbnail: { type: String, default: null },
        cache: {
            about: { type: String, default: null }
        }
    },
    misc: {
        color: { type: String, default: "#29BB8E" },
        daily: { type: String, default: null },
        money: { type: Number, default: 0 },
        embed: { type: String, default: "#29BB8E" },
        locale: { type: String, default: null },
        weather: { type: Boolean, default: true },
        fixed_badge: { type: Number, default: null },
        second_lang: { type: String, default: null }
    },
    conf: {
        banned: { type: Boolean, default: false },
        ghost_mode: { type: Boolean, default: false },
        notify: { type: Boolean, default: true },
        ranking: { type: Boolean, default: true },
        global_tasks: { type: Boolean, default: true },
        public_badges: { type: Boolean, default: true },
        resumed: { type: Boolean, default: false },
        cached_guilds: { type: Boolean, default: false }
    }
})

const model = mongoose.model("User", schema)

async function checkUser(uid) {

    // Verifica se há registros do usuário informado no banco
    if (await model.exists({ uid: uid }))
        return model.findOne({
            uid: uid
        })

    return false
}

async function getUser(uid) {
    if (!await model.exists({ uid: uid }))
        await model.create({
            uid: uid
        })

    return model.findOne({
        uid: uid
    })
}

async function getRankMoney() {
    return model.find({
        "misc.money": { $gt: 0.01 }
    }).sort({
        "misc.money": -1
    }).limit(25)
}

// Buscando os usuários que estão inativos para realizar a exclusão dos dados
async function getOutdatedUsers(timestamp) {

    return await model.find({
        "erase.erase_on": { $lte: timestamp }
    })
}

// Exclui o usuário por completo
async function dropUser(uid) {
    await model.findOneAndDelete({
        uid: uid
    })
}

module.exports.User = model
module.exports = {
    getUser,
    checkUser,
    dropUser,
    getRankMoney,
    getOutdatedUsers,
    colorsMap,
    colorsPriceMap,
    defaultUserEraser
}