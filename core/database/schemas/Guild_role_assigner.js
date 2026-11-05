const mongoose = require("mongoose")

// sid -> Server ID

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    interaction: { type: String, default: null },
    atribute: { type: String, default: null },
    ignore: { type: String, default: null },
    type: { type: String, default: "global" },
    status: { type: Boolean, default: false }
})

schema.index({ sid: 1, type: 1 })

const model = mongoose.model("Guild_role_assigner", schema)

async function getRoleAssigner(sid, type) {

    return (await model.findOne({ sid: sid, type: type })) || model.create({ sid: sid, type: type })
}

async function getActiveRoleAssigner(type) {

    return model.find({
        type: type,
        status: true
    })
}

async function dropRoleAssigner(sid, type) {

    await model.findOneAndDelete({
        sid: sid,
        type: type
    })
}

module.exports.Guild_role_assigner = model
module.exports = {
    getRoleAssigner,
    getActiveRoleAssigner,
    dropRoleAssigner
}