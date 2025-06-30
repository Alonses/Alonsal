const mongoose = require("mongoose")

// sid -> Server ID

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    rank: { type: Number, default: 0 },
    action: { type: String, default: null },
    role: { type: String, default: null },
    timeout: { type: Number, default: 2 },
    strikes: { type: Number, default: 0 },
    timed_role: {
        status: { type: Boolean, default: false },
        timeout: { type: Number, default: 12 }
    }
})

const model = mongoose.model("Guild_warns", schema)

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

// Apaga todas as advertências criadas no servidor
async function dropAllGuildWarns(sid) {
    await model.deleteMany({
        sid: sid
    })
}

module.exports.Guild_warns = model
module.exports = {
    getGuildWarn,
    listAllGuildWarns,
    dropGuildWarn,
    dropAllGuildWarns
}