const { readdirSync } = require('fs')
const mongoose = require("mongoose")

const loggerMap = {
    "none": "📝",
    "message_edit": "📝",
    "message_delete": "🚮",
    "member_nick": "🔖",
    "member_image": "👤",
    "member_role": "🔖",
    "member_join": "🆕",
    "member_left": "🛫",
    "channel_created": "🆕",
    "channel_delete": "🚮",
    "member_ban_add": "🔨",
    "member_ban_remove": "✅",
    "member_punishment": "🔇",
    "member_kick": "👟",
    "member_kick_2": "👟",
    "member_mute": "🔇",
    "member_ban": "🔨",
    "member_voice_status": "📻",
    "invite_created": "🔗",
    "invite_deleted": "🔗"
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

const defaultEraser = {
    1: 172800, // 2 dias
    2: 345600, // 4 dias
    3: 236700, // 5 dias
    4: 604800, // 7 dias
    5: 1209600 // 14 dias
}

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    lang: { type: String, default: "pt-br" },
    inviter: { type: String, default: null },
    erase: {
        valid: { type: Boolean, default: false },
        timeout: { type: Number, default: 5 },
        timestamp: { type: String, default: null }
    },
    games: {
        channel: { type: String, default: null },
        role: { type: String, default: null }
    },
    tickets: {
        category: { type: String, default: null }
    },
    warn: {
        notify: { type: Boolean, default: true },
        notify_exclusion: { type: Boolean, default: true },
        timed: { type: Boolean, default: false },
        channel: { type: String, default: null },
        timeout: { type: Number, default: 2 },
        reset: { type: Number, default: 7 },
    },
    reports: {
        channel: { type: String, default: null },
        notify: { type: Boolean, default: false },
        auto_ban: { type: Boolean, default: false }
    },
    speaker: {
        regional_limit: { type: Boolean, default: false },
        channels: { type: String, default: null }
    },
    logger: {
        channel: { type: String, default: null },
        message_edit: { type: Boolean, default: true },
        message_delete: { type: Boolean, default: true },
        member_nick: { type: Boolean, default: false },
        member_image: { type: Boolean, default: true },
        member_role: { type: Boolean, default: true },
        member_join: { type: Boolean, default: true },
        member_left: { type: Boolean, default: true },
        channel_created: { type: Boolean, default: false },
        channel_delete: { type: Boolean, default: false },
        member_punishment: { type: Boolean, default: true },
        member_kick: { type: Boolean, default: true },
        member_ban_add: { type: Boolean, default: true },
        member_ban_remove: { type: Boolean, default: true },
        member_voice_status: { type: Boolean, default: false },
        invite_created: { type: Boolean, default: false },
        invite_deleted: { type: Boolean, default: false }
    },
    spam: {
        notify: { type: Boolean, default: true },
        strikes: { type: Boolean, default: true },
        timeout: { type: Number, default: 2 },
        data: { type: String, default: null },
        trigger_amount: { type: Number, default: 5 },
        suspicious_links: { type: Boolean, default: false }
    },
    network: {
        link: { type: String, default: null },
        channel: { type: String, default: null },
        member_punishment: { type: Boolean, default: true },
        member_ban_add: { type: Boolean, default: true },
        member_kick: { type: Boolean, default: true }
    },
    conf: {
        games: { type: Boolean, default: false },
        tickets: { type: Boolean, default: false },
        reports: { type: Boolean, default: false },
        conversation: { type: Boolean, default: false },
        broadcast: { type: Boolean, default: false },
        logger: { type: Boolean, default: false },
        spam: { type: Boolean, default: false },
        network: { type: Boolean, default: false },
        warn: { type: Boolean, default: false },
        nuke_invites: { type: Boolean, default: false }
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

async function getReportNetworkChannels(link) {

    // Lista todos os servidores com reports de usuários ativos que fazem parte de um network específico
    return model.find({
        "network.link": link,
        "conf.reports": true
    })
}

async function disableGuildFeatures(client, sid) {
    // Desliga os recursos do servidor
    const guild = await getGuild(sid)

    guild.inviter = null
    guild.network.link = null

    guild.conf.games = false
    guild.conf.reports = false
    guild.conf.tickets = false
    guild.conf.conversation = false
    guild.conf.broadcast = false
    guild.conf.logger = false
    guild.conf.spam = false
    guild.conf.network = false
    guild.conf.warn = false
    guild.conf.nuke_invites = false

    // Registrando a exclusão de dados do servidor
    guild.erase.timestamp = client.timestamp() + defaultEraser[guild?.erase.timeout || 5]
    guild.erase.valid = true

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
        "network.link": link
    })
}

async function getRankHosters(client) {

    // Lista todos os servidores com hosters salvos
    const guilds = await model.find({
        "inviter": { $ne: null }
    })

    const users_map = {}
    const rank = []

    guilds.forEach(guild => {
        // Contabilizando os convites de cada hoster
        if (users_map[guild.inviter])
            users_map[guild.inviter]++
        else
            users_map[guild.inviter] = 1
    })

    Object.keys(users_map).forEach(key => {
        rank.push({
            "uid": key,
            "invites": users_map[key]
        })
    })

    // Ordenando a lista de hosters que convidaram o bot
    rank.sort(function (a, b) {
        if (a.invites < b.invites) return 1
        if (a.invites > b.invites) return -1
        return 0
    })

    // Retornando apenas os dois primeiros
    return [await client.getUser(rank[0].uid), await client.getUser(rank[1].uid)]
}

async function getTimedGuilds() {
    // Lista todas as advertências que se expirão
    return model.find({
        "warn.timed": true
    })
}

// Lista todos os servidores salvos
async function listAllGuilds() {
    return model.find()
}

async function getEraseGuilds() {

    // Lista todos os servidores que estão marcados para exclusão
    return model.find({
        "erase.valid": true
    })
}

// Exclui o servidor por completo
async function dropGuild(sid) {

    await model.findOneAndDelete({
        sid: sid
    })
}

module.exports.Guild = model
module.exports = {
    getGuild,
    listAllGuilds,
    getGameChannels,
    disableGuildFeatures,
    getReportChannels,
    getReportNetworkChannels,
    getGameChannelById,
    migrateGameChannels,
    getNetworkedGuilds,
    getRankHosters,
    getTimedGuilds,
    getEraseGuilds,
    dropGuild,
    loggerMap,
    channelTypes,
    defaultEraser
}