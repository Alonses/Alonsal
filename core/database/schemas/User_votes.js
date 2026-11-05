const mongoose = require("mongoose")

// uid -> User ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    vote: { type: String, default: null },
    timestamp: { type: Number, default: null }
})

schema.index({ uid: 1 })

const model = mongoose.model("User_vote", schema)

async function registryVote(uid) {
    return (await model.findOne({ uid: uid })) || model.create({ uid: uid })
}

async function getVotes() {

    const votes = await model.find({}), total = {}
    total.qtd = votes.length

    // Soma todos os votos registrados
    votes.forEach(voto => {

        if (total[voto.vote])
            total[voto.vote]++
        else
            total[voto.vote] = 1
    })

    return total
}

async function verifyUser(uid) {
    return model.findOne({
        uid: uid
    })
}

module.exports.User_vote = model
module.exports = {
    getVotes,
    verifyUser,
    registryVote
}