const mongoose = require("mongoose")

// Relação de dias
// 0 -> Dias úteis
// 1 -> Finais de semana
// 2 -> Todo dia

// 4 -> Domingo
// 5 -> Segunda
// 6 -> Terça
// 7 -> Quarta
// 8 -> Quinta
// 9 -> Sexta
// 10 -> Sábado

const moduleDays = {
    0: "🏭",
    1: "🛹",
    2: "📆",
    4: "🛵",
    5: "💀",
    6: "🤡",
    7: "🐸",
    8: "🚀",
    9: "🍺",
    10: "🕺"
}

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    type: { type: Number, default: null },
    data: { type: Number, default: null },
    stats: {
        price: { type: Number, default: 20 },
        days: { type: Number, default: null },
        hour: { type: String, default: null },
        active: { type: Boolean, default: false },
        timestamp: { type: Number, default: null }
    }
})

const model = mongoose.model("Module", schema)

async function getActiveModules() {
    return model.find({
        "stats.active": true
    })
}

async function createModule(uid, type, timestamp) {
    await model.create({
        uid: uid,
        type: type,
        "stats.timestamp": timestamp
    })

    return model.findOne({
        uid: uid,
        "stats.timestamp": timestamp
    })
}

async function getModule(uid, timestamp) {
    return model.findOne({
        uid: uid,
        "stats.timestamp": timestamp
    })
}

async function dropModule(uid, type, timestamp) {
    await model.findOneAndDelete({
        uid: uid,
        type: type,
        "stats.timestamp": timestamp
    })
}

async function dropAllUserModules(uid) {
    await model.deleteMany({
        uid: uid
    })
}

async function verifyUserModules(uid, type) {
    return model.find({
        uid: uid,
        type: type
    })
}

// Lista todos os módulos de determinado usuário
async function listAllUserModules(uid) {
    return model.find({
        uid: uid
    })
}

async function shutdownAllUserModules(uid, type) {
    const user_modules = await listAllUserModules(uid)

    if (typeof type === "undefined") // Desliga todos os módulos do usuário
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

// Retorna um preço pelos módulos ativos de determinado usuário
async function getModulesPrice(uid) {
    let total = 0
    let modulos = await model.find({
        uid: uid,
        "stats.active": true
    })


    modulos.forEach(element => {
        total += element.stats.price
    })

    return total
}

module.exports.Badge = model
module.exports = {
    createModule,
    getModule,
    dropModule,
    getModulesPrice,
    getActiveModules,
    listAllUserModules,
    dropAllUserModules,
    verifyUserModules,
    shutdownAllUserModules,
    moduleDays
}