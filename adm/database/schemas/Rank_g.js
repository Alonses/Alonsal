const { readdirSync } = require('fs')
const mongoose = require("mongoose")

// udi -> User ID
// sid -> Server ID

const users = {}

const schema = new mongoose.Schema({
    uid: String,
    sid: { type: String, default: null },
    nickname: { type: String, default: null },
    lastValidMessage: { type: Number, default: null },
    warns: { type: Number, default: 0 },
    caldeira_de_ceira: { type: Boolean, default: false },
    xp: { type: Number, default: 0 }
})

const model = mongoose.model("Rankobal", schema)

async function getRankGlobal() {
    if (!await model.exists()) return

    return model.find()
}

async function createRankGlobal(uid, server_id, experience) {
    await model.create({ uid: uid, sid: server_id, xp: experience })
}

async function migrateRankGlobal() {

    // Migrando os dados do JSON para o banco externo
    for (const folder of readdirSync(`./arquivos/data/rank/`)) {
        for (const file of readdirSync(`./arquivos/data/rank/${folder}`)) {

            let i = 0
            const data = require(`../../../arquivos/data/rank/${folder}/${file}`)

            users[file.split(".json")[0]] = data

            // await model.create({ uid: data.id, sid: folder, nickname: data.nickname, lastValidMessage: data.lastValidMessage, warns: data.warns, caldeira_de_ceira: data.caldeira_de_ceira, xp: data.xp })
        }
    }

    console.log(users)
}

module.exports.Rankobal = model
module.exports.getRankGlobal = getRankGlobal
module.exports.createRankGlobal = createRankGlobal
module.exports.migrateRankGlobal = migrateRankGlobal