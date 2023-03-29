const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID
// cid -> Channel ID

const schema = new mongoose.Schema({
    sid: String,
    uid: String,
    cid: { type: String, default: null }
})

const model = mongoose.model("Ticket", schema)

async function getTicket(sid, uid) {
    if (!await model.exists({ sid: sid, uid: uid })) await model.create({ sid: sid, uid: uid })

    return model.findOne({ sid: sid, uid: uid })
}

// Apaga o ticket de denúncia do servidor
async function dropTicket(sid, uid) {
    model.findOneAndDelete({ sid: sid, uid: uid })
}

module.exports.Ticket = model
module.exports.getTicket = getTicket
module.exports.dropTicket = dropTicket