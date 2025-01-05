const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID
// ixp -> XP utilizado pelo Bot ( imutável pelo usuário )
// o IXP é um campo que o bot faz uso para contabilizar o ranking global

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    nickname: { type: String, default: null },
    lastInteraction: { type: Number, default: null },
    warns: { type: Number, default: 0 },
    caldeira_de_ceira: { type: Boolean, default: false },
    xp: { type: Number, default: 0 },
    ixp: { type: Number, default: 0 },
    erase: {
        valid: { type: Boolean, default: false },
        erase_on: { type: Number, default: null }
    }
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

async function encryptUserRankServers(uid, new_user_id) {

    await model.updateMany(
        { uid: uid },
        {
            $set: {
                uid: new_user_id
            }
        }
    )
}

async function listRankGuild(sid) {
    return model.find({
        sid: sid
    })
}

async function listAllUserRankGuild(uid) {
    return model.find({
        uid: uid
    })
}

async function getAllUsers() {
    return model.find()
}

async function getUserRankServers(uid) {
    if (!await model.exists({ uid: uid }))
        return

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

// Buscando os usuários que estão desatualizados no escopo de servidor para exclusão dos dados
async function getGuildOutdatedUsers(timestamp) {

    return await model.find({
        "erase.erase_on": { $lte: timestamp }
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

// Define um tempo de expiração para todos os usuários sem tempo definido no escopo de servidor
async function getUnknowLastInteraction(client) {

    const users = await model.find({ "erase.erase_on": null })

    for (let i = 0; i < users.length; i++) {

        const usuario = users[i]
        usuario.erase.erase_on = client.timestamp() + 2419200

        await usuario.save()
    }
}

module.exports.Rankerver = model
module.exports = {
    getAllUsers,
    getRankServer,
    listRankGuild,
    getUserRankServer,
    getUserRankServers,
    getGuildOutdatedUsers,
    createRankServer,
    updateUserRank,
    dropUserRankServer,
    dropAllRankGuild,
    dropAllUserGuildRanks,
    dropUnknownRankServers,
    getUnknowLastInteraction,
    encryptUserRankServers,
    listAllUserRankGuild
}