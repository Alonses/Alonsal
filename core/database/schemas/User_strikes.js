const mongoose = require("mongoose")

// uid - User ID
// sid - Server ID

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

async function listAllUserStrikes(uid, sid) {

    // Listando todos os strikes que um usuário recebeu em um servidor
    return model.find({
        uid: uid,
        sid: sid,
        valid: true
    })
}

// Apagando todos os strikes registrados no servidor sobre um membro
async function dropAllUserGuildStrikes(sid) {
    await model.deleteMany({
        sid: sid
    })
}

module.exports.Strike = model
module.exports = {
    getUserStrikes,
    removeStrike,
    dropAllUserGuildStrikes,
    listAllUserStrikes
}