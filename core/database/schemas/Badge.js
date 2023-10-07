const { readdirSync } = require('fs')
const mongoose = require("mongoose")

const { getRankMoney } = require('./User')
const { getRankGlobal } = require('./Rank_g')

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    badge: { type: Number, default: null },
    timestamp: { type: Number, default: null }
})

const model = mongoose.model("Badge", schema)

async function getUserBadges(uid) {
    return model.find({
        uid: uid
    })
}

async function createBadge(uid, badge_id, timestamp) {
    await model.create({
        uid: uid,
        badge: badge_id,
        timestamp: timestamp
    })
}

async function removeBadge(uid, badge_id) {
    await model.findOneAndDelete({
        uid: uid,
        badge: badge_id
    })
}

async function verifyDynamicBadge(client, alvo, badge_id) {

    let top_users = await (alvo === "bufunfas" ? getRankMoney() : getRankGlobal())
    if (top_users.length < 2) return

    const users = {}

    // Badges do primeiro colocado no rank de bufunfas
    await getUserBadges(top_users[0].uid)
        .then(badges => {
            badges.forEach(badge => {
                if (users[top_users[0].uid])
                    users[top_users[0].uid].push(badge.badge)
                else
                    users[top_users[0].uid] = [badge.badge]
            })
        })

    // Badges do segundo colocado no rank de bufunfas
    await getUserBadges(top_users[1].uid)
        .then(badges => {
            badges.forEach(badge => {
                if (users[top_users[1].uid])
                    users[top_users[1].uid].push(badge.badge)
                else
                    users[top_users[1].uid] = [badge.badge]
            })
        })

    if (users[top_users[0].uid]) { // Verificando se o primeiro colocado possui a badge dinâmica enviada
        if (!users[top_users[0].uid].includes(badge_id))
            createBadge(top_users[0].uid, badge_id, client.timestamp())
    } else
        createBadge(top_users[0].uid, badge_id, client.timestamp())

    // Verificando se o segundo colocado possui a badge dinâmica e removendo-a
    if (users[top_users[1].uid] && users[top_users[1].uid].includes(badge_id)) {
        removeBadge(top_users[1].uid, badge_id)

        // Removendo a badge dinâmica do fixado caso o usuário não possua mais
        if (top_users[1].misc.fixed_badge === badge_id) {
            top_users[1].misc.fixed_badge = null

            await top_users[1].save()
        }
    }
}

async function migrateBadges() {

    let entradas = 0

    for (const file of readdirSync(`./files/data/user/`)) {
        const { badge_list } = require(`../../../files/data/user/${file}`)

        const id_user = file.split(".json")[0]

        if (badge_list.length > 0) {
            const badge_list_c = await getUserBadges(id_user)
            let badges_array = []

            // Listando as badges do usuário
            badge_list_c.forEach(valor => badges_array.push(valor.badge))

            for (let i = 0; i < badge_list.length; i++) {

                // Verificando se o usuário não possui a badge importada
                if (!badges_array.includes(parseInt(Object.keys(badge_list[i])[0]))) {
                    await model.create({
                        uid: id_user,
                        badge: parseInt(Object.keys(badge_list[i])[0]),
                        timestamp: parseInt(Object.values(badge_list[i])[0])
                    })

                    entradas++
                }
            }
        }
    }
}

module.exports.Badge = model
module.exports = {
    createBadge,
    removeBadge,
    getUserBadges,
    migrateBadges,
    verifyDynamicBadge
}