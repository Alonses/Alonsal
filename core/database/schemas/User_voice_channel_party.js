const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID
// mid -> Member ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    mid: { type: String, default: null }
})

const model = mongoose.model("User_voice_channel_party", schema)

async function verifyPartyMember(uid, sid, mid) {
    return await model.exists({ uid: uid, sid: sid, mid: mid })
}

async function registerPartyMember(uid, sid, mid) {
    await model.create({ uid: uid, sid: sid, mid: mid })
}

async function dropPartyMember(uid, sid, mid) {
    await model.deleteMany({ uid: uid, sid: sid, mid: mid })
}

async function verifyUserParty(uid, sid, global_config) {

    if (global_config) // Coleta todos os registros que possuem o membro como autor
        return model.find({ uid: uid })

    return model.find({ uid: uid, sid: sid })
}

async function dropVoiceChannelParty(uid, sid, global_config) {

    if (global_config) // Exclui de forma global o grupo
        await model.deleteMany({ uid: uid })
    else { // Exclui apenas os grupos por servidor específico
        await model.deleteMany({
            uid: uid,
            sid: sid
        })
    }
}

module.exports.User_voice_channel_party = model
module.exports = {
    verifyPartyMember,
    verifyUserParty,
    dropVoiceChannelParty,
    registerPartyMember,
    dropPartyMember
}