const { readdirSync } = require('fs')
const mongoose = require("mongoose")

// udi -> User ID
// sid -> Server ID

const schema = new mongoose.Schema({
    uid: String,
    sid: { type: String, default: "pt-br" },
    xp: { Number, default: 0 }
})

const model = mongoose.model("Rankerver", schema)

async function getRank(uid, sid) {
    if (!await model.exists({ uid: uid, sid: sid })) await model.create({ uid: uid, sid: sid })

    return model.find({ uid: uid, sid: sid })
}

async function createRank(uid, server_id, experience) {
    await model.create({ uid: uid, sid: server_id, xp: experience })
}

async function migrateRank() {

    for (const file of readdirSync(`./arquivos/data/user/`)) {
        const { badges } = require(`../../../arquivos/data/user/${file}`)

        const id = file.split(".json")[0]

        for (let i = 0; i < badges.badge_list.length; i++) {
            await model.create({ uid: id, sid: parseInt(Object.keys(badges.badge_list[i])[0]), timestamp: parseInt(Object.values(badges.badge_list[i])[0]) })
        }
    }
}

module.exports.Rank = model
module.exports.getRank = getRank
module.exports.createRank = createRank
module.exports.migrateRank = migrateRank