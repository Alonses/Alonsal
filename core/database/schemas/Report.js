const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    issuer: { type: String, default: null },
    relatory: { type: String, default: null },
    timestamp: { type: Number, default: null },
    archived: { type: Boolean, default: false },
    auto: { type: Boolean, default: false }
})

const model = mongoose.model("Report", schema)

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
    })
}

async function checkUserGuildReported(sid) {
    return model.find({
        sid: sid,
        archived: false
    }).limit(50)
}

module.exports.Report = model
module.exports = {
    getReport,
    dropReport,
    getUserReports,
    getReportedUsers,
    checkUserGuildReported
}