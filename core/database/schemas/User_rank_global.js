const mongoose = require("mongoose")

// uid -> User ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    nickname: { type: String, default: null },
    xp: { type: Number, default: 0 }
})

schema.index({ uid: 1 }, { unique: true })
schema.index({ xp: -1 })

const model = mongoose.model("User_rank_global", schema)

async function getRankGlobal() {
    return model.find().sort({
        xp: -1
    }).limit(50)
}

// Grava o XP global em uma única operação atômica (cria o registro se não existir)
async function setUserGlobalRank(uid, xp, sid, nickname) {
    const options = { upsert: true, setDefaultsOnInsert: true }

    try {
        await model.updateOne({ uid: uid }, { $set: { xp: xp, sid: sid } }, options)
    } catch (err) {
        if (err.code !== 11000) throw err
        await model.updateOne({ uid: uid }, { $set: { xp: xp, sid: sid } })
    }

    if (nickname)
        await model.updateOne({ uid: uid, nickname: null }, { $set: { nickname: nickname } })
}

async function getUserGlobalRank(uid, xp, nickname, sid) {
    return (await model.findOne({ uid: uid })) || model.create({ uid: uid, xp: xp, nickname: nickname, sid: sid })
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
    setUserGlobalRank,
    dropUserGlobalRank,
    findUserGlobalRankIndex
}