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

schema.index({ uid: 1, sid: 1 }, { unique: true })
schema.index({ sid: 1, xp: -1 })
schema.index({ "erase.erase_on": 1 })

const model = mongoose.model("User_rank_guild", schema)

// Upsert atômico: evita documentos duplicados quando várias interações chegam ao mesmo tempo
async function upsertRankServer(uid, sid) {
    const options = { upsert: true, new: true, setDefaultsOnInsert: true }

    try {
        return await model.findOneAndUpdate({ uid: uid, sid: sid }, { $setOnInsert: { uid: uid, sid: sid } }, options)
    } catch (err) {
        if (err.code !== 11000) throw err
        return model.findOne({ uid: uid, sid: sid })
    }
}

// Aplica ganho de XP e demais campos de forma atômica, retornando o documento já atualizado
async function applyRankServerUpdate(uid, sid, update) {
    return model.findOneAndUpdate({ uid: uid, sid: sid }, update, { new: true })
}

async function getRankServer(sid) {
    const users = await model.find({
        sid: sid
    }).sort({
        xp: -1
    }).limit(50)

    return users.length ? users : null
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
    const servers = await model.find({
        uid: uid
    })

    return servers.length ? servers : undefined
}

async function getUserRankServer(uid, sid) {
    return upsertRankServer(uid, sid)
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

// Iguala o XP interno ao XP em todos os servidores do usuário com uma única operação
async function syncRankServersIxp(uid) {
    return model.updateMany({ uid: uid }, [{ $set: { ixp: "$xp" } }])
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
    const timestamp_atual = client.execute("timestamp")

    for (let i = 0; i < users.length; i++) {

        const usuario = users[i]
        usuario.erase.erase_on = timestamp_atual + 2419200

        await usuario.save()
    }
}

module.exports.User_rank_guild = model
module.exports = {
    getAllUsers,
    getRankServer,
    listRankGuild,
    getUserRankServer,
    applyRankServerUpdate,
    syncRankServersIxp,
    getUserRankServers,
    getGuildOutdatedUsers,
    createRankServer,
    updateUserRank,
    dropUserRankServer,
    dropAllRankGuild,
    dropAllUserGuildRanks,
    dropUnknownRankServers,
    getUnknowLastInteraction,
    listAllUserRankGuild
}