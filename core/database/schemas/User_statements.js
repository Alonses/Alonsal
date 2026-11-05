const mongoose = require("mongoose")

const { data_encrypt, data_encrypt_random, data_decipher } = require("../../data/crypto")

// uid -> User ID
// Os dados são gravados cifrados e lidos já decifrados:
// IDs usam cifra determinística (permite buscas) e textos usam cifra aleatória

const encryptId = value => {
    if (value === null || value === undefined || value === "") return value

    const text = String(value)
    return text.startsWith("d.") ? text : data_encrypt(text)
}

const encryptContent = value => {
    if (value === null || value === undefined || value === "") return value

    const text = String(value)
    return text.startsWith("r.") ? text : data_encrypt_random(text)
}

const decrypt = value => typeof value === "string" ? data_decipher(value) : value

const schema = new mongoose.Schema({
    uid: { type: String, default: null, set: encryptId, get: decrypt },
    operation: { type: String, default: null, set: encryptContent, get: decrypt },
    type: { type: Boolean, default: false }, // false -> saída, true -> entrada
    value: { type: Number, default: 0 },
    timestamp: { type: Number, default: null }
})

schema.index({ uid: 1, timestamp: -1 })

const model = mongoose.model("User_statements", schema)

async function registryStatement(client, uid, operation, type, value) {

    // Mantém apenas as 10 últimas movimentações, excluindo as mais antigas
    const antigas = await model.find({ uid: uid }, { _id: 1 }).sort({ timestamp: -1 }).skip(9).lean()
    if (antigas.length > 0)
        model.deleteMany({ _id: { $in: antigas.map(s => s._id) } }).catch(() => { })

    await model.create({
        uid: uid,
        operation: operation,
        type: type,
        value: value,
        timestamp: client.execute("timestamp")
    })
}

async function getUserStatements(uid) {
    return model.find({
        uid: uid
    }).sort({
        timestamp: -1
    })
}

async function dropUserStatement(uid, timestamp) {
    await model.findOneAndDelete({
        uid: uid,
        timestamp: timestamp
    })
}

async function dropAllUserStatements(uid) {
    await model.deleteMany({
        uid: uid
    })
}

module.exports.User_statements = model
module.exports = {
    registryStatement,
    getUserStatements,
    dropUserStatement,
    dropAllUserStatements
}