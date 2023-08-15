const mongoose = require("mongoose")

// uid -> userID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    vote: { type: String, default: null },
    timestamp: { type: Number, default: null }
})

const model = mongoose.model("Vote", schema)

async function registryVote(uid) {
    if (!await model.exists({ uid: uid }))
        await model.create({
            uid: uid
        })

    return model.findOne({
        uid: uid
    })
}

async function getVotes() {

    const votes = await model.find({})
    const total = {}

    // Soma todos os votos registrados
    votes.forEach(voto => {

        if (total[voto.vote])
            total[voto.vote]++
        else
            total[voto.vote] = 1
    })

    return total
}

module.exports.Vote = model
module.exports = {
    getVotes,
    registryVote
}