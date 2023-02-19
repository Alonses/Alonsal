const { readdirSync } = require('fs')
const mongoose = require("mongoose")

// udi -> User ID
// sid -> Server ID

const schema = new mongoose.Schema({
    uid: String,
    sid: { type: String, default: null },
    nickname: { type: String, default: null },
    lastValidMessage: { type: Number, default: null },
    warns: { type: Number, default: 0 },
    caldeira_de_ceira: { type: Boolean, default: false },
    xp: { type: Number, default: 0 }
})

const model = mongoose.model("Rankerver", schema)

async function getRankServer(sid) {
    if (!await model.exists({ sid: sid })) await model.create({ sid: sid })

    return model.find({ sid: sid })
}

async function getUserRankServer(uid, sid) {
    if (!await model.exists({ uid: uid, sid: sid })) await model.create({ uid: uid, sid: sid })

    return model.find({ uid: uid, sid: sid })
}

async function createRankServer(uid, server_id, experience) {
    await model.create({ uid: uid, sid: server_id, xp: experience })
}

async function migrateRankServer() {

    // Migrando os dados do JSON para o banco externo
    for (const folder of readdirSync(`./arquivos/data/rank/`)) {
        for (const file of readdirSync(`./arquivos/data/rank/${folder}`)) {

            const data = require(`../../../arquivos/data/rank/${folder}/${file}`)

            await model.create({ uid: data.id, sid: folder, nickname: data.nickname, lastValidMessage: data.lastValidMessage, warns: data.warns, caldeira_de_ceira: data.caldeira_de_ceira, xp: data.xp })
        }
    }
}

module.exports.Rankerver = model
module.exports.getRankServer = getRankServer
module.exports.getUserRankServer = getUserRankServer
module.exports.createRankServer = createRankServer
module.exports.migrateRankServer = migrateRankServer