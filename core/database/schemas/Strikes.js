const mongoose = require("mongoose")

// uid - User ID
// sid - Server ID

const spamTimeoutMap = {
    1: 3600,   // 1 hora
    2: 7200,   // 2 horas
    3: 21700,  // 6 horas
    4: 43200,  // 12 horas
    5: 86400,  // 1 dia
    6: 172800, // 2 dias
    7: 259200, // 3 dias
    8: 432000, // 5 dias
    9: 604800  // 7 dias
}

const defaultStrikes = {
    1: 7200,   // 2 horas
    2: 21700,  // 6 horas
    3: 172800, // 2 dias
    4: 604800, // 7 dias
}

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    strikes: { type: Number, default: 0 }
})

const model = mongoose.model("Strike", schema)

async function getUserStrikes(uid, sid) {
    if (!await model.exists({ uid: uid, sid: sid }))
        await model.create({
            uid: uid,
            sid: sid
        })

    return model.findOne({
        uid: uid,
        sid: sid
    })
}

async function removeStrike(uid, sid) {
    await model.findOneAndDelete({
        uid: uid,
        sid: sid
    })
}

// Apagando todos os strikes registrados no servidor
async function dropAllGuildStrikes(sid) {
    await model.deleteMany({
        sid: sid
    })
}

module.exports.Strike = model
module.exports = {
    getUserStrikes,
    removeStrike,
    dropAllGuildStrikes,
    spamTimeoutMap,
    defaultStrikes
}