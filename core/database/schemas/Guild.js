const mongoose = require("mongoose")

const { data_encrypt, data_decipher } = require("../../data/crypto")
const { defaultEraser } = require("../../formatters/patterns/timeout")

// IDs do Discord são gravados cifrados (determinístico, para permitir buscas) e lidos já em formato numérico.
// O setter é idempotente: valores já cifrados não são cifrados novamente. Valores vazios passam direto.
const encryptId = value => {
    if (value === null || value === undefined || value === "") return value

    const text = String(value)
    return text.startsWith("d.") ? text : data_encrypt(text)
}

const decryptId = value => typeof value === "string" ? data_decipher(value) : value

const discordId = { type: String, default: null, set: encryptId, get: decryptId }

const schema = new mongoose.Schema({
    sid: discordId,
    lang: { type: String, default: "pt-br" },
    inviter: discordId,
    erase: {
        valid: { type: Boolean, default: false },
        timeout: { type: Number, default: 5 },
        timestamp: { type: String, default: null }
    },
    iddle: {
        timeout: { type: Number, default: 3 },
        timestamp: { type: String, default: null }
    },
    games: {
        channel: discordId,
        role: discordId
    },
    tickets: {
        category: discordId
    },
    voice_channels: {
        timeout: { type: String, default: 0 },
        preferences: {
            mute_popup: { type: Boolean, default: true },
            allow_text: { type: Boolean, default: false },
            allow_preferences: { type: Boolean, default: true }
        }
    },
    warn: {
        notify: { type: Boolean, default: true },
        notify_exclusion: { type: Boolean, default: true },
        timed: { type: Boolean, default: false },
        channel: discordId,
        timeout: { type: Number, default: 2 },
        reset: { type: Number, default: 7 },
        erase_ban_messages: { type: Number, default: 0 },
        timed_channel: discordId,
        announce: {
            status: { type: Boolean, default: false },
            channel: discordId
        },
        hierarchy: {
            status: { type: Boolean, default: false },
            strikes: { type: Number, default: 3 },
            timed: { type: Boolean, default: false },
            reset: { type: Number, default: 4 },
            channel: discordId
        }
    },
    reports: {
        channel: discordId,
        auto_ban: { type: Boolean, default: false },
        notify: { type: Boolean, default: false },
        role: discordId,
        erase_ban_messages: { type: Number, default: 0 }
    },
    nuke_invites: {
        type: { type: Boolean, default: false },
        channel: discordId
    },
    logger: {
        channel: discordId,
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
    death_note: {
        note: { type: Boolean, default: false },
        notify: { type: Boolean, default: true },
        channel: discordId,
        member_punishment: { type: Boolean, default: true },
        member_kick: { type: Boolean, default: true },
        member_ban_add: { type: Boolean, default: true },
        member_ban_remove: { type: Boolean, default: true }
    },
    spam: {
        notify: { type: Boolean, default: true },
        strikes: { type: Boolean, default: true },
        timeout: { type: Number, default: 2 },
        manage_mods: { type: Boolean, default: false },
        trigger_amount: { type: Number, default: 5 },
        suspicious_links: { type: Boolean, default: false },
        channel: discordId,
        scanner: {
            links: { type: Boolean, default: false }
        },
        auto_kick: {
            status: { type: Boolean, default: false },
            timeout: { type: Number, default: 4 }
        }
    },
    network: {
        link: discordId,
        channel: discordId,
        member_punishment: { type: Boolean, default: true },
        member_ban_add: { type: Boolean, default: true },
        member_kick: { type: Boolean, default: true },
        erase_ban_messages: { type: Number, default: 0 },
        scanner: {
            type: { type: Boolean, default: true }
        }
    },
    timed_roles: {
        timeout: { type: Number, default: 5 },
        channel: discordId
    },
    misc: {
        second_lang: { type: String, default: null },
        subscription: {
            // Já armazena o uid cifrado do usuário (comparado diretamente com user.uid)
            id_owner: { type: String, default: null, set: encryptId },
            active: { type: Boolean, default: false },
            expires: { type: Number, default: null }
        }
    },
    conf: {
        games: { type: Boolean, default: false },
        tickets: { type: Boolean, default: false },
        reports: { type: Boolean, default: false },
        logger: { type: Boolean, default: false },
        spam: { type: Boolean, default: false },
        network: { type: Boolean, default: false },
        warn: { type: Boolean, default: false },
        ranking: { type: Boolean, default: false },
        voice_channels: { type: Boolean, default: false },
        nuke_invites: { type: Boolean, default: false }
    }
})

schema.index({ sid: 1 })
schema.index({ inviter: 1 })
schema.index({ "games.channel": 1 })
schema.index({ "network.link": 1 })

// Cache curto com os sids de cada link de network (consulta leve, sem hidratar os documentos).
// É limpo sempre que um servidor é salvo, então vínculos novos ou removidos aparecem na hora.
const network_sids = new Map()
const NETWORK_TTL = 60 * 1000

schema.post("save", () => network_sids.clear())

const model = mongoose.model("Guild", schema)

function getNetworkSids(link) {

    const cached = network_sids.get(link)
    if (cached && cached.expires > Date.now()) return cached.promise

    const promise = model.find({ "network.link": link }, { sid: 1, _id: 0 }).lean()
        .then(docs => docs.map(doc => data_decipher(doc.sid)))
        .catch(err => {
            network_sids.delete(link)
            throw err
        })

    network_sids.set(link, { promise, expires: Date.now() + NETWORK_TTL })
    return promise
}

async function getGuild(sid) {
    return (await model.findOne({ sid: sid })) || model.create({ sid: sid })
}

// Leitura leve apenas das chaves de ativação, sem hidratar o documento (usada em painéis de navegação)
async function getGuildConf(sid) {
    return (await model.findOne({ sid: sid }, { conf: 1 }).lean()) || (await model.create({ sid: sid })).toObject()
}

async function getSpecificGameChannel(gcid) {

    // Busca apenas o servidor com o canal ativo
    return model.find({
        "games.channel": gcid
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

    // Registrando a exclusão de dados do servidor
    guild.erase.timestamp = client.execute("timestamp") + defaultEraser[guild?.erase.timeout || 5]
    guild.erase.valid = true

    await guild.save()
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
    return [await client.execute("getUser", { id_user: rank[0].uid }), await client.execute("getUser", { id_user: rank[1].uid })]
}

async function getTimedGuilds() {
    // Lista todas as advertências que se expirão
    return model.find({
        "warn.timed": true
    })
}

async function getTimedPreGuilds() {
    // Lista todas as anotações de advertências que se expirão
    return model.find({
        "warn.hierarchy.timed": true
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

async function listAllGuildHoster(user_id) {
    // Lista todos os servidores onde o Alonsal foi adicionado por um membro
    return model.find({
        "inviter": user_id
    })
}

async function listAllRankedGuilds() {
    // Lista todos os servidores que possuem o rankeamento de membros ativo
    return model.find({
        "conf.ranking": true
    })
}

async function listAllVoicedGuilds() {

    return model.find({
        "conf.voice_channels": true
    })
}

module.exports.Guild = model
module.exports = {
    getGuild,
    listAllGuilds,
    getGameChannels,
    getSpecificGameChannel,
    disableGuildFeatures,
    getReportChannels,
    listAllGuildHoster,
    listAllRankedGuilds,
    listAllVoicedGuilds,
    getReportNetworkChannels,
    getGameChannelById,
    getNetworkedGuilds,
    getNetworkSids,
    getGuildConf,
    getRankHosters,
    getTimedGuilds,
    getTimedPreGuilds,
    getEraseGuilds,
    dropGuild
}