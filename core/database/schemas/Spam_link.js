const mongoose = require("mongoose")

// sid -> Server ID

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    link: { type: String, default: null },
    register: { type: String, default: null }
})

const model = mongoose.model("SpamLink", schema)

async function verifySuspiciousLink(link) {

    const verify = await getSuspiciousLink(link)

    if (!verify)
        return false
    else
        return true
}

async function getSuspiciousLink(link) {
    return model.findOne({
        link: link
    })
}

async function registerSuspiciousLink(link, guild_id, timestamp) {
    await model.create({
        link: link,
        sid: guild_id,
        register: timestamp
    })
}

async function dropSuspiciousLink(link) {

    await model.findOneAndDelete({
        link: link
    })
}

module.exports.SpamLink = model
module.exports = {
    getSuspiciousLink,
    dropSuspiciousLink,
    verifySuspiciousLink,
    registerSuspiciousLink,
}