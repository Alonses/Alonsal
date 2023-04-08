const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID

const users = {}

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    relatory: { type: String, default: null },
    timestamp: { type: Number, default: 0 },
    archived: { type: Boolean, default: false }
})

const model = mongoose.model("Report", schema)

async function getReport(uid, sid) {
    if (!await model.exists({ uid: uid, sid: sid })) await model.create({ uid: uid, sid: sid })

    return model.findOne({ uid: uid, sid: sid })
}

async function getUserReports(uid) {
    return model.find({ uid: uid })
}

module.exports.getReport = getReport
module.exports.getUserReports = getUserReports