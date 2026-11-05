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
    hierarchy: { type: Boolean, default: false },
    valid: { type: Boolean, default: false },
    timeout: { type: Boolean, default: true },
    assigner: discordId,
    assigner_nick: secretText,
    relatory: secretText,
    timestamp: { type: Number, default: null }
})

schema.index({ uid: 1, sid: 1, timestamp: 1 })
schema.index({ sid: 1 })

const model = mongoose.model("User_warns", schema)

async function getUserWarn(uid, sid, timestamp) {

    const q = { uid: uid, sid: sid, timestamp: timestamp }
    return (await model.findOne(q)) || model.create(q)
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

async function listAllUserCachedHierarchyWarns(uid, sid) {

    // Listando todas as advertências que um usuário recebeu em um servidor
    return model.find({
        uid: uid,
        sid: sid,
        hierarchy: true,
        valid: false
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

module.exports.User_warns = model
module.exports = {
    getUserWarn,
    checkUserGuildWarned,
    listAllUserWarns,
    listAllUserCachedHierarchyWarns,
    removeUserWarn,
    listAllCachedUserWarns,
    dropAllUserGuildWarns,
    dropAllGuildWarns
}