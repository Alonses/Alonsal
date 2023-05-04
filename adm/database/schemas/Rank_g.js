const mongoose = require("mongoose")

const { getAllUsers } = require('./Rank_s')

// uid -> User ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null },
    nickname: { type: String, default: null },
    lastValidMessage: { type: Number, default: null },
    warns: { type: Number, default: 0 },
    caldeira_de_ceira: { type: Boolean, default: false },
    xp: { type: Number, default: 0 }
})

const model = mongoose.model("Rankobal", schema)

async function getRankGlobal() {
    return model.find({})
}

async function getUserGlobalRank(uid, experience, nickname, sid) {
    if (!await model.exists({ uid: uid })) return model.create({ uid: uid, xp: experience, nickname: nickname, sid: sid })

    return model.findOne({ uid: uid })
}

const users_ranking = []
const maior_ranking = []

async function migrateRankGlobal() {

    const usuarios = await getAllUsers()

    for (let i = 0; i < usuarios.length; i++) {
        users_ranking.push(usuarios[i])
    }

    for (let i = 0; i < users_ranking.length; i++) {
        for (let x = 0; x < usuarios.length; x++) {
            if (users_ranking[i].uid === usuarios[x].uid)
                if (maior_ranking[i]) {
                    if (maior_ranking[i].xp < usuarios[x].xp)
                        maior_ranking[i].xp = usuarios[x].xp
                } else
                    maior_ranking[i] = users_ranking[x]
        }
    }

    // Salvando no banco
    for (let i = 0; i < maior_ranking.length; i++) {
        await getUserGlobalRank(maior_ranking[i].uid, maior_ranking[i].xp, maior_ranking[i].nickname, maior_ranking[i].sid)
    }
}

module.exports.Rankobal = model
module.exports = {
    getRankGlobal,
    getUserGlobalRank,
    migrateRankGlobal
}