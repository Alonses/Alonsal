const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, defaul: null },
    name: { type: String, default: null },
    timestamp: { type: Number, default: null }
})

const model = mongoose.model("Task_group", schema)

async function createGroup(uid, name, sid, timestamp) {
    if (!await model.exists({ uid: uid, sid: sid, name: name }))
        await model.create({
            uid: uid,
            name: name,
            sid: sid,
            timestamp: timestamp
        })

    return model.findOne({
        uid: uid,
        sid: sid,
        name: name
    })
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

module.exports.Task_group = model
module.exports = {
    createGroup,
    getUserGroup,
    checkUserGroup,
    dropAllUserGroups,
    listAllUserGroups,
    dropGroup
}