const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID
// cid -> Channel ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    cid: { type: String, default: null }
})

const model = mongoose.model("User_voice_channel", schema)

async function verifyUserVoiceChannel(uid, sid) {
    return model.findOne({ uid: uid, sid: sid })
}

async function verifyChannelVoice(cid, sid) {
    return model.findOne({ cid: cid, sid: sid })
}

async function registryVoiceChannel(uid, sid) {
    await model.create({
        uid: uid,
        sid: sid
    })

    return model.findOne({ uid: uid, sid: sid })
}

async function dropVoiceChannel(uid, sid) {
    await model.findOneAndDelete({
        uid: uid,
        sid: sid
    })
}

async function listAllVoiceChannels() {
    return model.find({})
}

module.exports.User_voice_channel = model
module.exports = {
    verifyUserVoiceChannel,
    verifyChannelVoice,
    registryVoiceChannel,
    dropVoiceChannel,
    listAllVoiceChannels
}