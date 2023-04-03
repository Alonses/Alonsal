const { readdirSync } = require('fs')
const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    sid: String,
    lang: { type: String, default: "pt-br" },
    games: {
        channel: { type: String, default: null },
        role: { type: String, default: null }
    },
    tickets: {
        category: { type: String, default: null }
    },
    conf: {
        games: { type: Boolean, default: false },
        tickets: { type: Boolean, default: false }
    }
})

const model = mongoose.model("Guild", schema)

async function getGuild(sid) {
    if (!await model.exists({ sid: sid })) await model.create({ sid: sid })

    return model.findOne({ sid: sid })
}

async function getGameChannels() {
    return model.find({ "conf.games": true })
}

async function migrateChannels() {

    for (const file of readdirSync(`./arquivos/data/games/`)) {
        const { canal, cargo, idioma } = require(`../../../arquivos/data/games/${file}`)

        let guild = await getGuild(file.replace(".json", ""))

        guild.games.channel = canal
        guild.games.role = cargo
        guild.conf.games = true

        guild.save()
    }
}

module.exports.Guild = model
module.exports.getGuild = getGuild
module.exports.getGameChannels = getGameChannels
module.exports.migrateChannels = migrateChannels