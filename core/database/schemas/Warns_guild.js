const mongoose = require("mongoose")

// sid -> Server ID

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    rank: { type: Number, default: 0 },
    action: { type: String, default: null },
    role: { type: String, default: null },
    timeout: { type: Number, default: 2 }
})

const model = mongoose.model("Warn_guild", schema)

// Procurando por uma advertência
async function getGuildWarn(sid, rank) {

    if (!await model.exists({ sid: sid, rank: rank }))
        await model.create({
            sid: sid,
            rank: rank
        })

    return model.findOne({
        sid: sid,
        rank: rank
    })
}

// Listando todas as advertências do servidor
async function listAllGuildWarns(sid) {

    return model.find({
        sid: sid
    })
}

// Apaga a advertência customizada
async function dropGuildWarn(sid, rank) {
    await model.findOneAndDelete({
        sid: sid,
        rank: rank
    })
}

module.exports.Warns_guild = model
module.exports = {
    getGuildWarn,
    listAllGuildWarns,
    dropGuildWarn
}