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

async function migrateGuilds() {

    return

    for (const file of readdirSync(`./arquivos/data/user/`)) {
        const { id, lang, social, misc, badges, conquistas } = require(`../../../arquivos/data/user/${file}`)

        let steam = "", lastfm = "", pula_predios = ""
        if (social) {
            if (typeof social.steam !== 'undefined')
                steam = social.steam

            if (typeof social.lastfm !== 'undefined')
                lastfm = social.lastfm

            if (typeof social.pula_predios !== 'undefined')
                pula_predios = social.pula_predios
        }

        await model.create({ uid: id, lang: lang || "pt-br", social: { steam: social.steam || "", lastfm: social.lastfm || "", pula_predios: social.pula_predios || "" }, misc: { daily: misc.daily || "", color: misc.color || "#29BB8E", money: misc.money || 0, embed: misc.embed || "#29BB8E", locale: misc.locale || "" }, badges: { badges: badges.fixed_badge || "", badge_list: badges.badge_list || [{ key: String, value: Number }] }, conquistas: conquistas || [{ key: String, value: Number }] })
    }
}

module.exports.Guild = model
module.exports.getGuild = getGuild
module.exports.migrateGuilds = migrateGuilds