const { readdirSync } = require('fs')
const mongoose = require("mongoose")

const loggerMap = {
    "message_edit": "📝",
    "message_delete": "🚮",
    "member_image": "👤",
    "member_role": "🔖",
    "member_join": "🆕",
    "member_left": "🛫",
    "channel_created": "🆕",
    "channel_delete": "🚮",
    "member_ban_add": "🔨",
    "member_ban_remove": "✅",
    "member_punishment": "🔇",
    "member_kick": "👟"
}

const channelTypes = {
    0: "💬",
    2: "🔊",
    4: "📂",
    5: "📣",
    10: "📣",
    11: "💬",
    12: "💬",
    13: "📣",
    15: "📯"
}

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    lang: { type: String, default: "pt-br" },
    games: {
        channel: { type: String, default: null },
        role: { type: String, default: null }
    },
    tickets: {
        category: { type: String, default: null }
    },
    reports: {
        channel: { type: String, default: null },
        notify: { type: Boolean, default: false },
        auto_ban: { type: Boolean, default: false }
    },
    logger: {
        channel: { type: String, default: null },
        message_edit: { type: Boolean, default: true },
        message_delete: { type: Boolean, default: true },
        member_image: { type: Boolean, default: true },
        member_role: { type: Boolean, default: true },
        member_join: { type: Boolean, default: true },
        member_left: { type: Boolean, default: true },
        channel_created: { type: Boolean, default: false },
        channel_delete: { type: Boolean, default: false },
        member_ban_add: { type: Boolean, default: true },
        member_ban_remove: { type: Boolean, default: true },
        member_kick: { type: Boolean, default: true }
    },
    spam: {
        strikes: { type: Boolean, default: true },
        timeout: { type: Number, default: 2 },
        data: { type: String, default: null }
    },
    network: {
        link: { type: String, default: null },
        member_punishment: { type: Boolean, default: true },
        member_ban_add: { type: Boolean, default: true },
        member_kick: { type: Boolean, default: true }
    },
    conf: {
        games: { type: Boolean, default: false },
        tickets: { type: Boolean, default: false },
        reports: { type: Boolean, default: false },
        public: { type: Boolean, default: false },
        conversation: { type: Boolean, default: true },
        broadcast: { type: Boolean, default: false },
        logger: { type: Boolean, default: false },
        spam: { type: Boolean, default: false },
        network: { type: Boolean, default: false }
    }
})

const model = mongoose.model("Guild", schema)

async function getGuild(sid) {
    if (!await model.exists({ sid: sid }))
        await model.create({
            sid: sid
        })

    return model.findOne({
        sid: sid
    })
}

async function getGameChannels() {
    // Lista todos os servidores com anúncios de games ativos
    return model.find({
        "conf.games": true
    })
}

async function getGameChannelById(id) {
    return model.findOne({
        "games.channel": id
    })
}

async function getReportChannels() {
    // Lista todos os servidores com reports de usuários ativos
    return model.find({
        "conf.reports": true
    })
}

async function getPublicGuilds() {
    // Lista todos os servidores com visibilidade ativa globalmente
    const servidores = await model.find({
        "conf.public": true
    }), lista = []

    servidores.forEach(servidor => {
        lista.push(servidor.sid)
    })

    return lista
}

async function disableGameChannel(sid) {
    // Desliga o anúncio de games para o servidor
    const guild = await getGuild(sid)

    guild.conf.games = false
    await guild.save()
}

async function disableReportChannel(sid) {
    // Desliga o anúncio de games para o servidor
    const guild = await getGuild(sid)

    guild.conf.reports = false
    await guild.save()
}

async function migrateGameChannels() {

    for (const file of readdirSync(`./files/data/games/`)) {
        const { canal, cargo } = require(`../../../files/data/games/${file}`)

        let guild = await getGuild(file.replace(".json", ""))

        guild.games.channel = canal
        guild.games.role = cargo
        guild.conf.games = true

        await guild.save()
    }
}

async function getNetworkedGuilds(link) {
    // Lista todos os servidores com network ativo
    return model.find({
        "conf.network": true,
        "network.link": link
    })
}

module.exports.Guild = model
module.exports = {
    getGuild,
    getGameChannels,
    getPublicGuilds,
    disableGameChannel,
    getReportChannels,
    getGameChannelById,
    disableReportChannel,
    migrateGameChannels,
    getNetworkedGuilds,
    loggerMap,
    channelTypes
}