const mongoose = require("mongoose")

// uid - User ID
// sid - Server ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    strikes: { type: Number, default: 0 }
})

const model = mongoose.model("User_strikes", schema)

async function getUserStrikes(uid, sid) {
    if (!await model.exists({ uid: uid, sid: sid }))
        await model.create({
            uid: uid,
            sid: sid
        })

    return model.findOne({
        uid: uid,
        sid: sid
    })
}

async function encryptUserStrikes(uid, new_user_id) {

    await model.updateMany(
        { uid: uid },
        {
            $set: {
                uid: new_user_id
            }
        }
    )
}

async function removeStrike(uid, sid) {
    await model.findOneAndDelete({
        uid: uid,
        sid: sid
    })
}

// Apagando todos os strikes registrados no servidor sobre um membro
async function dropUserGuildStrikes(sid) {
    await model.deleteMany({
        sid: sid
    })
}

module.exports.User_strike = model
module.exports = {
    getUserStrikes,
    removeStrike,
    dropUserGuildStrikes,
    encryptUserStrikes
}