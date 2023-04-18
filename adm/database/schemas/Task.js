const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    group: { type: String, default: null },
    text: { type: String, default: null },
    timestamp: { type: Number, default: 0 },
    cached: { type: Boolean, default: false },
    concluded: { type: Boolean, default: false }
})

const model = mongoose.model("Task", schema)

async function createTask(uid, sid, text, timestamp) {

    if (!await model.exists({ uid: uid, sid: sid, text: text, timestamp: timestamp })) await model.create({ uid: uid, sid: sid, text: text, timestamp: timestamp })

    return model.findOne({ uid: uid, sid: sid, text: text, timestamp: timestamp })
}

async function getTask(uid, timestamp) {
    return model.findOne({ uid: uid, timestamp: timestamp })
}

async function listAllUserTasks(uid, sid) {

    if (sid)
        return model.find({ uid: uid, cached: false, sid: sid })

    return model.find({ uid: uid, cached: false })
}

async function listAllUserGroupTasks(uid, name, sid) {

    if (sid)
        return model.find({ uid: uid, group: name, sid: sid })

    return model.find({ uid: uid, group: name })
}

// Apaga uma task do usuário
async function dropTask(uid, timestamp) {
    await model.findOneAndDelete({ uid: uid, timestamp: timestamp })
}

async function dropTaskByGroup(uid, name) {
    await model.deleteMany({ uid: uid, group: name })
}

module.exports.Task = model
module.exports = {
    createTask,
    getTask,
    dropTask,
    dropTaskByGroup,
    listAllUserTasks,
    listAllUserGroupTasks
}