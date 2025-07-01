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
    timestamp: { type: Number, default: null }
})

const model = mongoose.model("User_pre_warn", schema)

async function getUserPreWarn(uid, sid, timestamp) {

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

async function checkUserGuildPreWarned(sid) {

    // Listando apenas os usuários que possuem anotações de advertência registradas no servidor
    return model.find({
        sid: sid,
        valid: true
    }).limit(50)
}

async function listAllUserPreWarns(uid, sid) {

    // Listando todas as anotações de advertência que um usuário recebeu em um servidor
    return model.find({
        uid: uid,
        sid: sid,
        valid: true
    })
}

async function listAllGuildPreWarns(sid) {

    // Lista todas as anotações de advertência válidas do servidor
    return model.find({
        sid: sid,
        valid: true
    })
}

async function listAllCachedUserPreWarns(uid, sid) {

    // Listando as anotações de advertência em cache do usuário
    return model.find({
        uid: uid,
        sid: sid,
        valid: false
    })
}

async function removeUserPreWarn(uid, sid, timestamp) {
    await model.findOneAndDelete({
        uid: uid,
        sid: sid,
        timestamp: timestamp
    })
}

async function dropAllUserGuildPreWarns(uid, sid) {

    // Remove todas as anotações de advertência que o usuário recebeu no servidor
    await model.deleteMany({
        uid: uid,
        sid: sid
    })
}

async function dropAllGuildPreWarns(sid) {

    // Remove todas as anotações de advertência registradas no servidor
    await model.deleteMany({
        sid: sid
    })
}

module.exports.User_pre_warn = model
module.exports = {
    getUserPreWarn,
    checkUserGuildPreWarned,
    listAllGuildPreWarns,
    listAllUserPreWarns,
    removeUserPreWarn,
    listAllCachedUserPreWarns,
    dropAllUserGuildPreWarns,
    dropAllGuildPreWarns,
    encryptUserPreWarn
}