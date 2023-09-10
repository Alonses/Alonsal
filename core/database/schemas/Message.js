const mongoose = require("mongoose")

// uid -> User ID
// sid -> Guild ID
// cid -> Channel ID
// mid -> Message ID

const schema = new mongoose.Schema({
    mid: { type: String, default: null },
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    cid: { type: String, default: null },
    content: { type: String, default: null },
    timestamp: { type: Number, default: null }
})

const model = mongoose.model("Message", schema)

async function getUserMessages(uid, sid) {
    return model.find({
        uid: uid,
        sid: sid
    })
        .sort({
            timestamp: -1
        })
}

async function createMessage(guild, message) {

    await model.create({
        uid: message.author.id,
        sid: guild.sid,
        cid: message.channelId,
        mid: message.id,
        content: message.content.trim().toLowerCase(),
        timestamp: message.createdTimestamp
    })
}

async function dropAllUserMessages(uid, sid) {
    await model.deleteMany({
        uid: uid,
        sid: sid
    })
}

module.exports.Message = model
module.exports = {
    createMessage,
    getUserMessages,
    dropAllUserMessages
}