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

const model = mongoose.model("Role_Assigner", schema)

async function getRoleAssigner(sid, type) {

    if (!await model.exists({ sid: sid, type: type }))
        await model.create({
            sid: sid,
            type: type
        })

    return model.findOne({
        sid: sid,
        type: type
    })
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

module.exports.Role_Assigner = model
module.exports = {
    getRoleAssigner,
    getActiveRoleAssigner,
    dropRoleAssigner
}