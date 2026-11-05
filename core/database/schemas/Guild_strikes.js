const mongoose = require("mongoose")

const { data_encrypt, data_decipher } = require("../../data/crypto")

// sid -> Server ID
// IDs do Discord são gravados cifrados (determinístico, permite buscas) e lidos já em formato numérico.
// O setter é idempotente: valores já cifrados não são cifrados novamente.

const encryptId = value => {
    if (value === null || value === undefined || value === "") return value

    const text = String(value)
    return text.startsWith("d.") ? text : data_encrypt(text)
}

const decryptId = value => typeof value === "string" ? data_decipher(value) : value

const discordId = { type: String, default: null, set: encryptId, get: decryptId }

const schema = new mongoose.Schema({
    sid: discordId,
    rank: { type: Number, default: 0 },
    action: { type: String, default: null },
    role: discordId,
    timeout: { type: Number, default: 2 },
    timed_role: {
        status: { type: Boolean, default: false },
        timeout: { type: Number, default: 12 }
    }
})

schema.index({ sid: 1, rank: 1 })

const model = mongoose.model("Guild_strikes", schema)

// Procurando por um strike
async function getGuildStrike(sid, rank) {

    return (await model.findOne({ sid: sid, rank: rank })) || model.create({ sid: sid, rank: rank })
}

// Listando todos os strikes do servidor
async function listAllGuildStrikes(sid) {
    return model.find({
        sid: sid
    }).sort({ rank: 1 })
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