const mongoose = require("mongoose")

// sid -> Server ID

const links_oficiais = ["youtu.be/", "youtube.com/", "google.com/", "tenor.com/"]

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    link: { type: String, default: null },
    timestamp: { type: String, default: null },
    valid: { type: Boolean, default: false }
})

const model = mongoose.model("Spam_Link", schema)

async function verifySuspiciousLink(link, force) {

    let confirmado = false

    if (typeof link === "object")
        for (let i = 0; i < link.length; i++) {
            if (!links_oficiais.includes(link[i]))
                if (await getSuspiciousLink(link[i], force))
                    confirmado = true
        }
    else if (!links_oficiais.includes(link))
        if (await getSuspiciousLink(link, force))
            confirmado = true

    return confirmado
}

async function getSuspiciousLink(link, force) {

    if (!force && !link.includes(".gg"))
        link = link.split("/")[0]

    return model.findOne({
        link: { $regex: link.replace(" ", ""), $options: "i" }
    })
}

async function getCachedSuspiciousLink(guild_id, timestamp) {
    return model.findOne({
        sid: guild_id,
        timestamp: timestamp
    })
}

async function registerSuspiciousLink(link, guild_id, timestamp) {

    let registrados = []

    if (typeof link !== "object") {
        if (!await verifySuspiciousLink(link, true)) {
            await model.create({
                link: link.replace(" ", ""),
                sid: guild_id,
                timestamp: timestamp,
                valid: true
            })

            registrados.push(link.replace(" ", "").split("").join(" "))
        }
    } else {
        for (let i = 0; i < link.length; i++) // Registrando uma lista de links maliciosos
            if (!await verifySuspiciousLink(link[i], true)) {
                await model.create({
                    link: link[i],
                    sid: guild_id,
                    timestamp: timestamp,
                    valid: true
                })

                registrados.push(link[i].replace(" ", "").split("").join(" "))
            }
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
    })
}

async function listAllSuspiciouLinks() {
    return await model.find({})
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