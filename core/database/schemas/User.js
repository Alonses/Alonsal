const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    lang: { type: String, default: null },
    hoster: { type: Boolean, default: false },
    nick: { type: String, default: null },
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
        // avatar: { type: String, default: null },
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
        notify: { type: Boolean, default: false },
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
        return false

    return model.findOne({
        uid: uid
    })
}

async function getEncryptedUser(uid) {

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

// Define um tempo de expiração para todos os usuários sem tempo definido
async function getUnknowUsers(client) {

    const users = await model.find({ "erase.erase_on": null })

    for (let i = 0; i < users.length; i++) {

        const usuario = users[i]
        usuario.erase.erase_on = client.timestamp() + 2419200

        await usuario.save()
    }
}

// Exclui o usuário por completo
async function dropUser(uid) {
    await model.findOneAndDelete({
        uid: uid
    })
}

// Lista todos os usuários com users fixadas
async function getUserWithFixedBadges() {

    return await model.find({
        "misc.fixed_badge": { $ne: null }
    })
}

async function updateUsers(client) {

    const users = await model.find()
    timedUpdate(client, users)
}

async function timedUpdate(client, users) {

    if (users.length > 0) {

        const user = users[0]
        let atualizado = false

        if (user.uid.length < 20) {
            user.uid = client.encrypt(user.uid)
            atualizado = true
        }

        if (user.uid.length > 80) {
            user.uid = client.decifer(user.uid)
            atualizado = true
        }

        if (atualizado) {
            console.log("atualizado", user)
            await user.save()
        }

        if (users.length % 50 == 0) console.log("Restam:", users.length)
        users.shift()

        setTimeout(() => {
            timedUpdate(client, users)
        }, 10)
    } else
        console.log("Finalizado")
}

module.exports.User = model
module.exports = {
    getUser,
    checkUser,
    dropUser,
    getRankMoney,
    getUnknowUsers,
    getOutdatedUsers,
    getUserWithFixedBadges,
    getEncryptedUser,
    updateUsers
}