const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    text: { type: String, default: null },
    timestamp: { type: Number, default: null },
    g_timestamp: { type: Number, defaul: null },
    concluded: { type: Boolean, default: false }
})

const model = mongoose.model("User_tasks", schema)

async function createTask(uid, sid, text, timestamp) {

    if (!await model.exists({ uid: uid, sid: sid, text: text, timestamp: timestamp }))
        await model.create({
            uid: uid,
            sid: sid,
            text: text,
            timestamp: timestamp
        })

    return model.findOne({
        uid: uid,
        sid: sid,
        text: text,
        timestamp: timestamp
    })
}

async function getTask(uid, timestamp) {
    return model.findOne({
        uid: uid,
        timestamp: timestamp
    })
}

async function listAllUserTasks(uid, sid) {

    if (sid)
        return model.find({
            uid: uid,
            sid: sid
        }).sort({
            timestamp: -1
        })

    return model.find({
        uid: uid
    }).sort({
        timestamp: -1
    })
}

async function listAllUserGroupTasks(uid, g_timestamp) {
    return model.find({
        uid: uid,
        g_timestamp: g_timestamp
    })
}

// Apaga uma task do usuário
async function dropTask(uid, timestamp) {
    await model.findOneAndDelete({
        uid: uid,
        timestamp: timestamp
    })
}

async function dropTaskByGroup(uid, g_timestamp) {
    await model.deleteMany({
        uid: uid,
        g_timestamp: g_timestamp
    })
}

async function dropAllUserTasks(uid) {
    await model.deleteMany({
        uid: uid
    })
}

async function dropAllGuildUserTasks(uid, sid) {
    await model.deleteMany({
        uid: uid,
        sid: sid
    })
}

module.exports.User_tasks = model
module.exports = {
    createTask,
    getTask,
    dropTask,
    dropTaskByGroup,
    dropAllUserTasks,
    listAllUserTasks,
    listAllUserGroupTasks,
    dropAllGuildUserTasks
}