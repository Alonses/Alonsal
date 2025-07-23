const mongoose = require("mongoose")

// uid - User ID
// sid - Server ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    strikes: { type: Number, default: 0 }
})

const model = mongoose.model("User_strikes", schema)

async function verifyUserStrikes(uid, sid) {
    if (!await model.exists({ uid: uid, sid: sid })) return null

    return model.findOne({
        uid: uid,
        sid: sid
    })
}

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

// Apagando todos os strikes registrados no servidor de um membro
async function dropUserGuildStrikes(uid, sid) {
    await model.deleteMany({
        uid: uid,
        sid: sid
    })
}

module.exports.User_strike = model
module.exports = {
    getUserStrikes,
    verifyUserStrikes,
    dropUserGuildStrikes
}