const { readdirSync } = require('fs')
const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    badge: { type: Number, default: null },
    timestamp: { type: Number, default: null }
})

const model = mongoose.model("Badge", schema)

async function getBadges(uid) {
    if (!await model.exists({ uid: uid })) await model.create({ uid: uid })

    return model.find({ uid: uid })
}

async function createBadge(uid, badge_id, timestamp) {
    await model.create({ uid: uid, badge: badge_id, timestamp: timestamp })
}

async function migrateBadges() {

    for (const file of readdirSync(`./arquivos/data/user/`)) {
        const { badges } = require(`../../../arquivos/data/user/${file}`)

        const id = file.split(".json")[0]

        for (let i = 0; i < badges.badge_list.length; i++) {
            await model.create({ uid: id, badge: parseInt(Object.keys(badges.badge_list[i])[0]), timestamp: parseInt(Object.values(badges.badge_list[i])[0]) })
        }
    }
}

module.exports.Badge = model
module.exports.getBadges = getBadges
module.exports.createBadge = createBadge
module.exports.migrateBadges = migrateBadges