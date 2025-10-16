const mongoose = require("mongoose")

const { randomString } = require("../../functions/random_string")

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    hash: { type: String, default: null },
    type: { type: Number, default: null },
    data: { type: Number, default: null },
    stats: {
        price: { type: Number, default: 10 },
        days: { type: Number, default: null },
        hour: { type: String, default: null },
        active: { type: Boolean, default: false },
        timestamp: { type: Number, default: null }
    },
    misc: {
        locale: { type: String, default: null },
        resumed: { type: Boolean, default: false },
        scope: { type: String, default: "user" },
        sid: { type: String, default: null },
        cid: { type: String, default: null }
    },
    rotative: {
        active: { type: Boolean, default: false },
        mid: { type: String, default: null }
    }
})

const model = mongoose.model("Module", schema)

async function getActiveModules() {
    return model.find({ "stats.active": true })
}

async function createModule(client, uid, type) {

    let new_hash = ''

    do {
        new_hash = randomString(15, client, true)
    } while (await model.exists({ hash: new_hash }))

    await model.create({
        uid: uid,
        type: type,
        hash: new_hash
    })

    return model.findOne({ hash: new_hash })
}

async function getModule(hash) {
    return model.findOne({ "hash": hash })
}

async function getGuildModule(sid, timestamp) {
    return model.findOne({
        "misc.sid": sid,
        "stats.timestamp": timestamp
    })
}

async function dropModule(hash) {
    await model.findOneAndDelete({ hash: hash })
}

async function dropAllUserModules(uid) {
    await model.deleteMany({
        uid: uid,
        "misc.sid": null
    })
}

async function verifyUserModules(uid, type) {
    return model.find({
        uid: uid,
        type: type,
        "misc.sid": null
    })
}

// Lista todos os módulos de determinado usuário
async function listAllUserModules(uid) {
    return model.find({
        uid: uid,
        "misc.sid": null
    })
}

async function listAllGuildModules(sid) {
    return model.find({ "misc.sid": sid })
}

async function shutdownAllUserModules(uid, type) {
    const user_modules = await listAllUserModules(uid)

    if (typeof type === "undefined") // Desliga todos os módulos do pessoais do usuário
        user_modules.forEach(async modulo => {
            modulo.stats.active = false
            await modulo.save()
        })
    else // Desliga todos os módulos de um tipo do usuário
        user_modules.forEach(async modulo => {
            if (modulo.type === type) {
                modulo.stats.active = false
                await modulo.save()
            }
        })
}

// Retorna um preço pelos módulos ativos do usuário
async function getModulesPrice(client, uid) {
    let total = 0
    let modulos = await model.find({
        uid: uid,
        "stats.active": true
    })

    modulos.forEach(element => { // Verificando se o usuário é assinante para aplicar desconto
        total += client.cached.subscribers.has(uid) ? element.stats.price * client.cached.subscriber_discount : element.stats.price
    })

    return client.execute("locale", { valor: total })
}

module.exports.Module = model
module.exports = {
    createModule,
    getModule,
    getGuildModule,
    dropModule,
    getModulesPrice,
    getActiveModules,
    listAllUserModules,
    listAllGuildModules,
    dropAllUserModules,
    verifyUserModules,
    shutdownAllUserModules
}