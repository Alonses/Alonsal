const mongoose = require("mongoose")

// uid - User ID
// sid - Server ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    nick: { type: String, default: null },
    valid: { type: Boolean, default: false },
    timeout: { type: Boolean, default: true },
    assigner: { type: String, default: null },
    assigner_nick: { type: String, default: null },
    relatory: { type: String, default: null },
    timestamp: { type: Number, default: null },
})

const model = mongoose.model("Warn", schema)

async function getUserWarn(uid, sid, timestamp) {

    if (!await model.exists({ uid: uid, sid: sid, timestamp: timestamp }))
        await model.create({
            uid: uid,
            sid: sid,
            timestamp: timestamp
        })

    return model.findOne({
        uid: uid,
        sid: sid,
        timestamp: timestamp
    })
}

async function checkUserGuildWarned(sid) {

    // Listando apenas os usuários que possuem advertências registradas no servidor
    return model.find({
        sid: sid,
        valid: true
    }).limit(50)
}

async function listAllUserWarns(uid, sid) {

    // Listando todas as advertências que um usuário recebeu em um servidor
    return model.find({
        uid: uid,
        sid: sid,
        valid: true
    })
}

async function listAllCachedUserWarns(uid, sid) {

    // Listando as advertências em cache do usuário
    return model.find({
        uid: uid,
        sid: sid,
        valid: false
    })
}

async function removeUserWarn(uid, sid, timestamp) {
    await model.findOneAndDelete({
        uid: uid,
        sid: sid,
        timestamp: timestamp
    })
}

async function dropAllUserGuildWarns(uid, sid) {

    // Remove todas as advertências que o usuário recebeu no servidor
    await model.deleteMany({
        uid: uid,
        sid: sid
    })
}

async function dropAllGuildWarns(sid) {

    // Remove todas as advertências registradas no servidor
    await model.deleteMany({
        sid: sid
    })
}

module.exports.Warn = model
module.exports = {
    getUserWarn,
    checkUserGuildWarned,
    listAllUserWarns,
    removeUserWarn,
    listAllCachedUserWarns,
    dropAllUserGuildWarns,
    dropAllGuildWarns
}