const mongoose = require("mongoose")

// uid -> User ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    group: { type: String, default: null },
    text: { type: String, default: null },
    timestamp: { type: Number, default: 0 },
    cached: { type: Boolean, default: true },
    concluded: { type: Boolean, default: false }
})

const model = mongoose.model("Task", schema)

async function createTask(uid, text, timestamp) {

    if (!await model.exists({ uid: uid, text: text, timestamp: timestamp })) await model.create({ uid: uid, text: text, timestamp: timestamp })

    return model.findOne({ uid: uid, text: text, timestamp: timestamp })
}

async function getTask(uid, timestamp) {
    return model.findOne({ uid: uid, timestamp: timestamp })
}

async function getCacheTask(uid, timestamp) {
    return model.findOne({ uid: uid, cached: true, timestamp: timestamp })
}

async function listAllUserTasks(uid) {
    return model.find({ uid: uid, cached: false })
}

// Apaga uma task do usuário
async function dropTask(uid, timestamp) {
    model.findOneAndDelete({ uid: uid, timestamp: timestamp })
}

async function deleteUserCachedTasks(uid) {
    model.deleteMany({ uid: uid, cached: true })
}

module.exports.Task = model
module.exports.createTask = createTask
module.exports.getTask = getTask
module.exports.getCacheTask = getCacheTask
module.exports.dropTask = dropTask
module.exports.listAllUserTasks = listAllUserTasks
module.exports.deleteUserCachedTasks = deleteUserCachedTasks