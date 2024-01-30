const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null }
})

const model = mongoose.model("User_guild", schema)

async function registerUserGuild(uid, sid) {
    if (!await model.exists({ uid: uid, sid: sid }))
        await model.create({
            uid: uid,
            sid: sid
        })
}

async function listAllUserGuilds(uid) {
    return model.find({
        uid: uid
    })
}

// Remove o registro de um servidor do usuário
async function dropUserGuild(uid, sid) {
    if (await model.exists({ uid: uid, sid: sid }))
        await model.findOneAndDelete({
            uid: uid,
            sid: sid
        })
}

module.exports.User_guild = model
module.exports = {
    registerUserGuild,
    listAllUserGuilds,
    dropUserGuild
}