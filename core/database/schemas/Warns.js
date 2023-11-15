const mongoose = require("mongoose")

// uid - User ID
// sid - Server ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    nick: { type: String, default: null },
    total: { type: Number, default: 0 },
    assigner: { type: String, default: null },
    relatory: { type: String, default: null },
    timestamp: { type: Number, default: null },
})

const model = mongoose.model("Warn", schema)

async function getUserWarns(uid, sid) {
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

async function checkUserGuildWarned(sid) {

    // Listando apenas os usuários que possuem advertências registradas no servidor
    return model.find({
        sid: sid,
        total: { $ne: 0 }
    }).limit(50)
}

async function removeWarn(uid, sid) {
    await model.findOneAndDelete({
        uid: uid,
        sid: sid
    })
}

module.exports.Warn = model
module.exports = {
    getUserWarns,
    checkUserGuildWarned,
    removeWarn
}