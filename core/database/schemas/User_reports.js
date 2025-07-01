const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    nick: { type: String, default: null },
    issuer: { type: String, default: null },
    issuer_nick: { type: String, default: null },
    relatory: { type: String, default: null },
    timestamp: { type: Number, default: null },
    archived: { type: Boolean, default: false },
    auto: { type: Boolean, default: false }
})

const model = mongoose.model("User_reports", schema)

async function getReport(uid, sid) {
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

async function dropReport(uid, sid) {
    await model.findOneAndDelete({
        uid: uid,
        sid: sid
    })
}

async function getUserReports(uid) {
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
    getUserReports,
    getReportedUsers,
    checkUserGuildReported,
    updateGuildReport
}