const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID
// ixp -> XP utilizado pelo Bot ( imutável pelo usuário )
// o IXP é um campo que o bot faz uso para contabilizar o ranking global

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    nickname: { type: String, default: null },
    lastValidMessage: { type: Number, default: null },
    warns: { type: Number, default: 0 },
    caldeira_de_ceira: { type: Boolean, default: false },
    xp: { type: Number, default: 0 },
    ixp: { type: Number, default: 0 }
})

const model = mongoose.model("Rankerver", schema)

async function getRankServer(sid) {
    if (!await model.exists({ sid: sid }))
        return null

    return model.find({
        sid: sid
    }).sort({
        xp: -1
    }).limit(50)
}

async function listRankGuild(sid) {
    return model.find({
        sid: sid
    })
}

async function getAllUsers() {
    return model.find()
}

async function getUserRankServers(uid) {
    if (!await model.exists({
        uid: uid
    })) return

    return model.find({
        uid: uid
    })
}

async function getUserRankServer(uid, sid) {
    if (!await model.exists({ uid: uid, sid: sid }))
        await model.create({
            uid: uid,
            sid: sid
        })

    return model.findOne({
        uid: uid,
        sid: sid
    })
}

async function createRankServer(uid, server_id, experience) {
    await model.create({
        uid: uid,
        sid: server_id,
        xp: experience
    })
}

async function dropUserRankServer(uid, sid) {
    await model.findOneAndDelete({
        uid: uid,
        sid: sid
    })
}

async function dropAllRankGuild(sid) {
    await model.deleteMany({
        sid: sid
    })
}

async function dropAllUserGuildRanks(uid) {
    await model.deleteMany({
        uid: uid
    })
}

async function dropUnknownRankServers(client, uid) {

    const guilds_ranking = await getUserRankServers(uid)

    // Procurando servidores que o usuário possui rank porém o bot não está incluso
    guilds_ranking.forEach(async valor => {
        let server = await client.guilds().get(valor.sid)

        if (!server)
            await dropUserRankServer(uid, valor.sid)
    })
}

async function updateUserRank() {

    const users = await this.getAllUsers()

    for (let i = 0; i < users.length; i++) {
        users[i].internal_xp = users[i].xp

        await users[i].save()
    }
}

module.exports.Rankerver = model
module.exports = {
    getAllUsers,
    getRankServer,
    listRankGuild,
    getUserRankServer,
    getUserRankServers,
    createRankServer,
    updateUserRank,
    dropUserRankServer,
    dropAllRankGuild,
    dropAllUserGuildRanks,
    dropUnknownRankServers
}