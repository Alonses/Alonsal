const mongoose = require("mongoose")

const { randomString } = require("../../functions/random_string")

const schema = new mongoose.Schema({
    link: { type: String, default: null }
})

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

module.exports.Guild_networks = model
module.exports = {
    createNetworkLink,
    dropNetwork
}