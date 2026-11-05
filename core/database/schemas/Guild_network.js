const mongoose = require("mongoose")

const { randomString } = require("../../functions/random_string")

const { data_encrypt, data_decipher } = require("../../data/crypto")

// O link é gravado cifrado (determinístico, para permitir buscas) e lido sempre em texto legível
const encryptLink = value => {
    if (value === null || value === undefined || value === "") return value

    const text = String(value)
    return text.startsWith("d.") ? text : data_encrypt(text)
}

const decryptLink = value => typeof value === "string" ? data_decipher(value) : value

const schema = new mongoose.Schema({
    link: { type: String, default: null, set: encryptLink, get: decryptLink }
})

schema.index({ link: 1 }, { unique: true, sparse: true })

const model = mongoose.model("Guild_networks", schema)

async function createNetworkLink(client) {

    let new_link = ''

    do {
        new_link = randomString(10, client)
    } while (await model.exists({ link: new_link }))

    await model.create({
        link: new_link
    })

    return new_link
}

async function dropNetwork(link) {
    await model.findOneAndDelete({
        link: link
    })
}

module.exports = {
    Guild_networks: model,
    createNetworkLink,
    dropNetwork
}