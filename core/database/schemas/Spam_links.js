const mongoose = require("mongoose")

// sid -> Server ID

const links_oficiais = ["youtu.be", "youtube.com", "google.com", "tenor.com", "discordapp.com"]

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    link: { type: String, default: null },
    timestamp: { type: String, default: null },
    valid: { type: Boolean, default: false }
})

const model = mongoose.model("Spam_Link", schema)

// Verificando se os links suspeitos estão registrados
async function verifySuspiciousLink(link, force) {

    let confirmado = false

    if (typeof link === "object")
        for (let i = 0; i < link.length; i++) {

            link[i] = link[i].split(")")[0]

            if (!links_oficiais.includes(link[i].split("/")[0]))
                if (await getSuspiciousLink(link[i], force))
                    confirmado = true
        }
    else if (!links_oficiais.includes(link.split("/")[0])) {

        link = link.split(")")[0]

        if (await getSuspiciousLink(link, force))
            confirmado = true
    }

    return confirmado
}

async function getSuspiciousLink(link, force) {

    if (link.includes(")"))
        link = link.split(")")[0]

    if (link.includes("||"))
        link = link.split("||")[0]

    return model.findOne({
        link: { $regex: link.replace(" ", ""), $options: "i" }
    })
}

async function getCachedSuspiciousLink(timestamp) {
    return model.findOne({
        timestamp: timestamp
    })
}

async function registerSuspiciousLink(link, guild_id, timestamp) {

    let registrados = []

    if (!await verifySuspiciousLink(link, true)) {

        if (link.includes(")"))
            link = link.split(")")[0]

        if (link.includes("("))
            link = link.split("(")[1]

        await model.create({
            link: link,
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

async function listAllSuspiciouLinks() {
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
        await reporte.save()
    })
}

module.exports.Spam_Link = model
module.exports = {
    getSuspiciousLink,
    dropSuspiciousLink,
    verifySuspiciousLink,
    listAllSuspiciouLinks,
    registerSuspiciousLink,
    registerCachedSuspiciousLink,
    getCachedSuspiciousLink,
    getAllGuildSuspiciousLinks,
    updateGuildSuspectLink
}