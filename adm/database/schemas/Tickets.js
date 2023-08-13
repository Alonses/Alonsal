const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID
// cid -> Channel ID

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    uid: { type: String, default: null },
    cid: { type: String, default: null }
})

const model = mongoose.model("Ticket", schema)

async function getTicket(sid, uid) {
    if (!await model.exists({ sid: sid, uid: uid }))
        await model.create({
            sid: sid,
            uid: uid
        })

    return model.findOne({
        sid: sid,
        uid: uid
    })
}

// Apaga o ticket de denúncia do servidor
async function dropTicket(sid, uid) {
    await model.findOneAndDelete({
        sid: sid,
        uid: uid
    })
}

module.exports.Ticket = model
module.exports = {
    getTicket,
    dropTicket
}