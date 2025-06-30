const mongoose = require("mongoose")

// sid -> Server ID

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    rank: { type: Number, default: 0 },
    action: { type: String, default: null },
    role: { type: String, default: null },
    timeout: { type: Number, default: 2 },
    timed_role: {
        status: { type: Boolean, default: false },
        timeout: { type: Number, default: 12 }
    }
})

const model = mongoose.model("Guild_strikes", schema)

// Procurando por um strike
async function getGuildStrike(sid, rank) {

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

// Listando todos os strikes do servidor
async function listAllGuildStrikes(sid) {
    return model.find({
        sid: sid
    })
}

// Apaga o strike customizado
async function dropGuildStrike(sid, rank) {
    await model.findOneAndDelete({
        sid: sid,
        rank: rank
    })
}

// Apaga todos os strikes criados no servidor
async function dropAllGuildStrikes(sid) {
    await model.deleteMany({
        sid: sid
    })
}

module.exports.Guild_strikes = model
module.exports = {
    getGuildStrike,
    listAllGuildStrikes,
    dropGuildStrike,
    dropAllGuildStrikes
}