const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, defaul: null },
    name: { type: String, default: null },
    timestamp: { type: Number, default: null }
})

schema.index({ uid: 1, sid: 1, name: 1 })

const model = mongoose.model("User_tasks_groups", schema)

async function createGroup(uid, name, sid, timestamp) {
    const q = { uid: uid, sid: sid, name: name }
    return (await model.findOne(q)) || model.create({ ...q, timestamp: timestamp })
}

async function getUserGroup(uid, timestamp) {
    return model.findOne({
        uid: uid,
        timestamp: timestamp
    })
}

async function listAllUserGroups(uid, sid) {

    if (sid)
        return model.find({
            uid: uid,
            sid: sid
        })

    return model.find({
        uid: uid
    })
}

async function checkUserGroup(uid, name, sid) {

    if (sid)
        return model.find({
            uid: uid,
            name: name,
            sid: sid
        })

    return model.find({
        uid: uid,
        name: name
    })
}

// Apaga o grupo de tasks do usuário
async function dropGroup(uid, timestamp) {
    await model.findOneAndDelete({
        uid: uid,
        timestamp: timestamp
    })
}

async function dropAllUserGroups(uid) {
    await model.deleteMany({
        uid: uid
    })
}

async function dropAllGuildUserGroups(uid, sid) {
    await model.deleteMany({
        uid: uid,
        sid: sid
    })
}

module.exports.User_tasks_groups = model
module.exports = {
    createGroup,
    getUserGroup,
    checkUserGroup,
    dropAllUserGroups,
    listAllUserGroups,
    dropGroup,
    dropAllGuildUserGroups
}