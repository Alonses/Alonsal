const mongoose = require("mongoose")

// sid -> Server ID

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    interaction: { type: String, default: null },
    atribute: { type: String, default: null },
    ignore: { type: String, default: null }
})

const model = mongoose.model("Role_Assigner", schema)

async function getRoleAssigner(sid) {

    if (!await model.exists({ sid: sid }))
        await model.create({
            sid: sid
        })

    return model.findOne({
        sid: sid
    })
}

async function dropRoleAssigner(sid) {

    await model.findOneAndDelete({
        sid: sid
    })
}

module.exports.Role_Assigner = model
module.exports = {
    getRoleAssigner,
    dropRoleAssigner
}