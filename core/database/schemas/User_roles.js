const mongoose = require("mongoose")

// uid - User ID
// sid - Server ID
// rid - Role ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    rid: { type: String, default: null },
    nick: { type: String, default: null },
    valid: { type: Boolean, default: false },
    timeout: { type: Number, default: 5 },
    assigner: { type: String, default: null },
    assigner_nick: { type: String, default: null },
    relatory: { type: String, default: null },
    timestamp: { type: Number, default: null }
})

const model = mongoose.model("User_role", schema)

async function getUserRole(uid, sid, timestamp) {

    if (!await model.exists({ uid: uid, sid: sid, timestamp: timestamp }))
        await model.create({
            uid: uid,
            sid: sid,
            timestamp: timestamp
        })

    return model.findOne({
        uid: uid,
        sid: sid,
        timestamp: timestamp
    })
}

async function getTimedRoleAssigner(uid, sid) {

    return model.findOne({
        uid: uid,
        sid: sid,
        valid: false
    }).sort({
        timestamp: -1
    }).limit(1)
}

async function checkUserGuildRoles(sid) {

    // Listando apenas os usuários que possuem cargos concedidos no servidor
    return model.find({
        sid: sid,
        valid: true
    }).limit(50)
}

async function listAllUserValidyRoles() {

    // Listando todos os membrosque possuem cargos temporários ativos
    return model.find({
        valid: true
    })
}

async function filterRemovedTimedRole(uid, sid, rid) {

    // Procura se há um cargo temporário ativo que foi removido manualmente por um moderador
    return model.find({
        uid: uid,
        sid: sid,
        rid: rid,
        valid: true
    })
}

async function listAllUserGuildRoles(uid, sid) {

    // Listando todos os cargos que um usuário recebeu em um servidor
    return model.find({
        uid: uid,
        sid: sid,
        valid: true
    })
}

async function listAllCachedUserGuildRoles(uid, sid) {

    // Listando os cargos em cache de um usuário
    return model.find({
        uid: uid,
        sid: sid,
        valid: false
    })
}

async function removeCachedUserRole(uid, sid) {
    await model.findOneAndDelete({
        uid: uid,
        sid: sid,
        valid: false
    })
}

async function dropAllUserGuildRoles(uid, sid) {

    // Remove todos os cargos que um usuário recebeu no servidor
    await model.deleteMany({
        uid: uid,
        sid: sid
    })
}

async function dropUserTimedRole(uid, sid, rid) {

    // Remove o cargo do vinculo com o membro
    await model.deleteMany({
        uid: uid,
        sid: sid,
        rid: rid
    })
}

async function dropAllGuildRoles(sid) {

    // Remove todos os cargos salvos no servidor
    await model.deleteMany({
        sid: sid
    })
}

module.exports.User_role = model
module.exports = {
    getUserRole,
    getTimedRoleAssigner,
    checkUserGuildRoles,
    listAllUserGuildRoles,
    removeCachedUserRole,
    listAllCachedUserGuildRoles,
    dropAllUserGuildRoles,
    dropAllGuildRoles,
    dropUserTimedRole,
    listAllUserValidyRoles,
    filterRemovedTimedRole
}