const mongoose = require("mongoose")

const { getRankMoney } = require('./User')
const { getRankGlobal } = require('./User_rank_global')
const { getRankHosters } = require('./Guild')

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

async function encryptUserBadges(uid, new_user_id) {

    await model.updateMany(
        { uid: uid },
        {
            $set: {
                uid: new_user_id
            }
        }
    )
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

async function updateUserBadges(client) {

    const badges = await model.find()
    timedUpdate(client, badges)
}

async function timedUpdate(client, badges) {

    if (badges.length > 0) {

        const badge = badges[0]
        let atualizado = false

        if (badge.uid.length < 20) {
            badge.uid = client.encrypt(badge.uid)
            atualizado = true
        }

        if (badge.uid.length > 80) {
            badge.uid = client.decifer(badge.uid)
            atualizado = true
        }

        if (atualizado) {
            console.log("atualizado", badge)
            await badge.save()
        }

        if (badges.length % 50 == 0) console.log("Restam:", badges.length)
        badges.shift()

        setTimeout(() => {
            timedUpdate(client, badges)
        }, 10)
    } else
        console.log("Finalizado")
}

module.exports.Badge = model
module.exports = {
    createBadge,
    removeBadge,
    getUserBadges,
    dropAllUserBadges,
    verifyDynamicBadge,
    encryptUserBadges,
    updateUserBadges
}