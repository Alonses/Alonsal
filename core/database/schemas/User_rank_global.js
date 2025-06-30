const mongoose = require("mongoose")

// uid -> User ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    nickname: { type: String, default: null },
    xp: { type: Number, default: 0 }
})

const model = mongoose.model("User_rank_global", schema)

async function getRankGlobal() {
    return model.find().sort({
        xp: -1
    }).limit(50)
}

async function getUserGlobalRank(uid, xp, nickname, sid) {
    if (!await model.exists({ uid: uid }))
        return model.create({
            uid: uid,
            xp: xp,
            nickname: nickname,
            sid: sid
        })

    return model.findOne({
        uid: uid
    })
}

async function findUserGlobalRankIndex(uid) {
    return model.findOne({
        uid: uid
    })
}

async function dropUserGlobalRank(uid) {
    await model.findOneAndDelete({
        uid: uid
    })
}

module.exports.User_rank_global = model
module.exports = {
    getRankGlobal,
    getUserGlobalRank,
    dropUserGlobalRank,
    findUserGlobalRankIndex
}