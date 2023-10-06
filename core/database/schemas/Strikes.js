const mongoose = require("mongoose")

// uid - User ID
// sid - Server ID

const spamTimeoutMap = {
    1: [3600, "1 hora"],   // 1 hora
    2: [7200, "2 horas"],   // 2 horas
    3: [21700, "6 horas"],  // 6 horas
    4: [43200, "12 horas"],  // 12 horas
    5: [86400, "1 dia"],  // 1 dia
    6: [172800, "2 dias"], // 2 dias
    7: [259200, "3 dias"], // 3 dias
    8: [604800, "7 dias"]  // 7 dias
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

module.exports.Strike = model
module.exports = {
    getUserStrikes,
    removeStrike,
    spamTimeoutMap,
    defaultStrikes
}