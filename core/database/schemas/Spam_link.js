const mongoose = require("mongoose")

// sid -> Server ID

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    link: { type: String, default: null },
    timestamp: { type: String, default: null }
})

const model = mongoose.model("Spam_Link", schema)

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
        timestamp: timestamp
    })
}

async function dropSuspiciousLink(link) {

    await model.findOneAndDelete({
        link: link
    })
}

async function updateGuildSuspectLink(sid) {

    // Movendo os links para o servidor do Alonsal
    const links = await model.find({
        sid: sid
    })

    links.forEach(async link => {
        link.sid = process.env.guild_id
        await reporte.save()
    })
}

module.exports.Spam_Link = model
module.exports = {
    getSuspiciousLink,
    dropSuspiciousLink,
    verifySuspiciousLink,
    registerSuspiciousLink,
    updateGuildSuspectLink
}