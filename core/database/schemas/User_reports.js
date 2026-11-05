const mongoose = require("mongoose")

const { data_encrypt, data_encrypt_random, data_decipher } = require("../../data/crypto")

// uid -> User ID
// sid -> Server ID
// Os dados são gravados cifrados e lidos já decifrados:
// IDs usam cifra determinística (permite buscas) e textos usam cifra aleatória (IV único por gravação)

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
    issuer: discordId,
    issuer_nick: secretText,
    relatory: secretText,
    timestamp: { type: Number, default: null },
    archived: { type: Boolean, default: false },
    auto: { type: Boolean, default: true }
})

schema.index({ uid: 1, sid: 1 })

const model = mongoose.model("User_reports", schema)

async function getReport(uid, sid) {
    return (await model.findOne({ uid: uid, sid: sid })) || model.create({ uid: uid, sid: sid })
}

async function dropReport(uid, sid) {
    await model.findOneAndDelete({
        uid: uid,
        sid: sid
    })
}

async function verifyUserReports(uid) {
    return model.find({
        uid: uid,
        archived: false
    })
}

async function getReportedUsers() {
    return model.find({
        archived: false
    }).sort({
        timestamp: -1
    })
}

async function checkUserGuildReported(sid) {
    return model.find({
        sid: sid,
        archived: false
    }).sort({
        timestamp: -1
    }).limit(50)
}

async function updateGuildReport(sid) {

    // Movendo os reportes para o servidor do Alonsal
    const reportes = await model.find({
        sid: sid
    })

    reportes.forEach(async reporte => {
        reporte.sid = process.env.guild_id
        await reporte.save()
    })
}

module.exports.User_reports = model
module.exports = {
    getReport,
    dropReport,
    verifyUserReports,
    getReportedUsers,
    checkUserGuildReported,
    updateGuildReport
}