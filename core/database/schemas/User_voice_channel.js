const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID
// cid -> Channel ID
// mid -> Message ID
// bit -> Bot ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    cid: { type: String, default: null },
    mid: { type: String, default: null },
    bit: { type: String, default: null },
    conf: {
        mute: { type: Boolean, default: false },
        trigger: { type: String, default: null }
    }
})

schema.index({ uid: 1, sid: 1 })
schema.index({ cid: 1, sid: 1 })

const model = mongoose.model("User_voice_channel", schema)

async function verifyUserVoiceChannel(uid, sid, trigger) {
    return model.findOne({
        uid: uid,
        sid: sid,
        "conf.trigger": trigger
    })
}

async function verifyVoiceChannel(cid, sid) {
    return model.findOne({ cid: cid, sid: sid })
}

async function registryVoiceChannel(uid, sid) {
    await model.create({
        uid: uid,
        sid: sid
    })

    return model.findOne({ uid: uid, sid: sid })
}

async function dropVoiceChannel(uid, cid) {
    await model.findOneAndDelete({
        uid: uid,
        cid: cid
    })
}

// Remove o registro pelo _id, inclusive registros sem cid (canal que não chegou a ser criado)
async function dropVoiceChannelById(id) {
    await model.deleteOne({ _id: id })
}

async function listAllVoiceChannels() {
    return model.find({})
}

module.exports.User_voice_channel = model
module.exports = {
    verifyUserVoiceChannel,
    verifyVoiceChannel,
    registryVoiceChannel,
    dropVoiceChannel,
    dropVoiceChannelById,
    listAllVoiceChannels
}