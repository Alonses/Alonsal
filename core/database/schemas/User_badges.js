const mongoose = require("mongoose")

const { getRankMoney } = require('./User')
const { getRankGlobal } = require('./User_rank_global')
const { getRankHosters } = require('./Guild')

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    badge: { type: Number, default: null },
    timestamp: { type: Number, default: null }
})

const model = mongoose.model("User_badges", schema)

async function getUserBadges(uid) {
    return model.find({
        uid: uid
    })
}

async function createBadge(uid, badge_id, timestamp) {

    if (!await model.exists({ uid: uid, badge: badge_id }))
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

async function dropAllUserBadges(uid) {
    await model.deleteMany({
        uid: uid
    })
}

async function verifyDynamicBadge(client, alvo, badge_id) {

    let top_users

    if (alvo !== "hoster")
        top_users = await (alvo === "bufunfas" ? getRankMoney() : getRankGlobal())
    else // Usuários que mais convidaram o Alonsal
        top_users = await getRankHosters(client)

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
            createBadge(top_users[0].uid, badge_id, client.execute("timestamp"))
    } else
        createBadge(top_users[0].uid, badge_id, client.execute("timestamp"))

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

module.exports.User_badges = model
module.exports = {
    createBadge,
    removeBadge,
    getUserBadges,
    dropAllUserBadges,
    verifyDynamicBadge
}