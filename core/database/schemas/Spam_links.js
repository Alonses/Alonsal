const mongoose = require("mongoose")

const { links_oficiais } = require("../../formatters/patterns/guild")

// sid -> Server ID

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    link: { type: String, default: null },
    timestamp: { type: String, default: null },
    valid: { type: Boolean, default: false }
})

const model = mongoose.model("Spam_Link", schema)

// Verificando se os links suspeitos estão registrados
async function verifySuspiciousLink(link) {

    if (typeof link === "object")
        for (let i = 0; i < link.length; i++) {

            link[i] = link[i].split(")")[0]

            if (!links_oficiais.includes(link[i].split("/")[0]))
                if (await getSuspiciousLink(link[i])) return true
        }
    else if (!links_oficiais.includes(link.split("/")[0]))
        if (await getSuspiciousLink(link.split(")")[0])) return true

    return false
}

async function getSuspiciousLink(link) {

    if (link.includes(")"))
        link = link.split(")")[0]

    if (link.includes("||"))
        link = link.split("||")[0]

    return model.findOne({
        link: link.trim()
    })
}

async function getCachedSuspiciousLink(timestamp) {
    return model.findOne({
        timestamp: timestamp
    })
}

async function registerSuspiciousLink(client, link, guild_id, timestamp) {

    let registrados = []
    link = link.replaceAll(" ", "")

    if (!await verifySuspiciousLink(client.encrypt(link))) {

        if (link.includes(")"))
            link = link.split(")")[0]

        if (link.includes("("))
            link = link.split("(")[1]

        await model.create({
            link: client.encrypt(link),
            sid: guild_id,
            timestamp: timestamp,
            valid: true
        })

        registrados.push(link.split("").join(" "))
    }

    return registrados
}

// Registrando um link suspeito provisório
async function registerCachedSuspiciousLink(link, guild_id, timestamp) {
    await model.create({
        link: link,
        sid: guild_id,
        timestamp: timestamp
    })
}

async function getAllGuildSuspiciousLinks(guild_id) {
    return await model.find({
        sid: guild_id
    }).sort({
        timestamp: -1
    })
}

async function listAllSuspiciousLinks() {
    return await model.find({}).sort({
        timestamp: -1
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
        await link.save()
    })
}

module.exports.Spam_Link = model
module.exports = {
    getSuspiciousLink,
    dropSuspiciousLink,
    verifySuspiciousLink,
    listAllSuspiciousLinks,
    registerSuspiciousLink,
    registerCachedSuspiciousLink,
    getCachedSuspiciousLink,
    getAllGuildSuspiciousLinks,
    updateGuildSuspectLink
}