const mongoose = require("mongoose")

// uid -> User ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    name: { type: String, default: null },
    timestamp: { type: Number, default: 0 }
})

const model = mongoose.model("Task_group", schema)

async function createGroup(uid, name, timestamp) {
    if (!await model.exists({ uid: uid, name: name })) await model.create({ uid: uid, name: name, timestamp: timestamp })

    return model.findOne({ uid: uid, name: name })
}

async function getUserGroup(uid, timestamp) {
    return model.findOne({ uid: uid, timestamp: timestamp })
}

async function getUserGroups(uid) {
    return model.find({ uid: uid })
}

async function checkUserGroup(uid, name) {
    return model.find({ uid: uid, name: name })
}

// Apaga o grupo de tasks do usuário
async function dropGroup(uid, timestamp) {
    await model.findOneAndDelete({ uid: uid, timestamp: timestamp })
}

module.exports.Task_group = model
module.exports.createGroup = createGroup
module.exports.getUserGroup = getUserGroup
module.exports.checkUserGroup = checkUserGroup
module.exports.getUserGroups = getUserGroups
module.exports.dropGroup = dropGroup