const { readdirSync } = require('fs')
const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    badge: { type: Number, default: null },
    timestamp: { type: Number, default: null }
})

const model = mongoose.model("Badge", schema)

async function getUserBadges(uid) {
    return model.find({ uid: uid })
}

async function createBadge(uid, badge_id, timestamp) {
    await model.create({ uid: uid, badge: badge_id, timestamp: timestamp })
}

async function migrateBadges() {

    let entradas = 0

    for (const file of readdirSync(`./arquivos/data/user/`)) {
        const { badge_list } = require(`../../../arquivos/data/user/${file}`)

        const id_user = file.split(".json")[0]

        if (badge_list.length > 0) {
            const badge_list_c = await getUserBadges(id_user)
            let badges_array = []

            // Listando as badges do usuário
            badge_list_c.forEach(valor => badges_array.push(valor.badge))

            for (let i = 0; i < badge_list.length; i++) {

                // Verificando se o usuário não possui a badge importada
                if (!badges_array.includes(parseInt(Object.keys(badge_list[i])[0]))) {
                    await model.create({ uid: id_user, badge: parseInt(Object.keys(badge_list[i])[0]), timestamp: parseInt(Object.values(badge_list[i])[0]) })

                    entradas++
                }
            }
        }
    }
}

module.exports.Badge = model
module.exports = {
    createBadge,
    getUserBadges,
    migrateBadges
}