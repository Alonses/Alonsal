const mongoose = require("mongoose")

const { data_encrypt, data_encrypt_random, data_decipher } = require("../../data/crypto")

// uid - User ID
// sid - Server ID
// Os dados são gravados cifrados e lidos já decifrados:
// IDs usam cifra determinística (permite buscas) e textos usam cifra aleatória

const encryptId = value => {
    if (value === null || value === undefined || value === "") return value

    const text = String(value)
    return text.startsWith("d.") ? text : data_encrypt(text)
}

const encryptContent = value => {
    if (value === null || value === undefined || value === "") return value
    return data_encrypt_random(String(value))
}

const decrypt = value => typeof value === "string" ? data_decipher(value) : value

const discordId = { type: String, default: null, set: encryptId, get: decrypt }
const secretText = { type: String, default: null, set: encryptContent, get: decrypt }

const schema = new mongoose.Schema({
    uid: discordId,
    sid: discordId,
    nick: secretText,
    valid: { type: Boolean, default: false },
    timeout: { type: Boolean, default: true },
    assigner: discordId,
    assigner_nick: secretText,
    relatory: secretText,
    timestamp: { type: Number, default: null }
})

schema.index({ uid: 1, sid: 1, timestamp: 1 })
schema.index({ sid: 1 })

const model = mongoose.model("User_pre_warn", schema)

async function getUserPreWarn(uid, sid, timestamp) {

    const q = { uid: uid, sid: sid, timestamp: timestamp }
    return (await model.findOne(q)) || model.create(q)
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

async function dropUserNote(uid, sid, timestamp) {

    await model.deleteOne({
        uid: uid,
        sid: sid,
        timestamp: timestamp
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
    dropUserNote
}