const mongoose = require("mongoose")

const { data_encrypt, data_encrypt_random, data_decipher } = require("../../data/crypto")
const { randomString } = require("../../functions/random_string")
const { listAllVoicedGuilds } = require("./Guild")

// sid -> Server ID
// Os dados são gravados cifrados e lidos já decifrados:
// IDs usam cifra determinística (permite buscas) e textos usam cifra aleatória

const encryptId = value => {
    if (value === null || value === undefined || value === "") return value

    const text = String(value)
    return text.startsWith("d.") ? text : data_encrypt(text)
}

const encryptContent = value => {
    if (value === null || value === undefined || value === "") return value

    const text = String(value)
    return text.startsWith("r.") ? text : data_encrypt_random(text)
}

const decrypt = value => typeof value === "string" ? data_decipher(value) : value

const discordId = { type: String, default: null, set: encryptId, get: decrypt }

const schema = new mongoose.Schema({
    sid: discordId,
    hash: { type: String, default: null },
    timestamp: { type: Number, default: null },
    config: {
        active: { type: Boolean, default: true },
        channel: discordId,
        category: discordId,
        category_nick: { type: String, default: null, set: encryptContent, get: decrypt },
        preferences: {
            user_limit: { type: Number, default: 0 },
            allow_text: { type: Boolean, default: false },
            always_private: { type: Boolean, default: false },
            voice_names: { type: String, default: "nicknames" }
        }
    }
})

schema.index({ sid: 1, hash: 1 })

const model = mongoose.model("Voice_trigger", schema)

// Retorna um trigger de voz que exista ou cria um novo e retorna
async function getGuildVoiceTrigger(client, sid, hash) {

    let new_hash = ''

    if (!hash) {
        do {
            new_hash = randomString(15, client, true)
        } while (await model.exists({ sid: sid, hash: new_hash }))

        hash = new_hash
    }

    return (await model.findOne({ sid: sid, hash: hash })) || model.create({
        sid: sid,
        hash: hash,
        timestamp: client.execute("timestamp")
    })
}

async function getVoiceTriggerByChannelId(sid, cid) {
    return model.findOne({
        sid: sid,
        "config.channel": cid
    })
}

async function verifyTwinTriggers(sid, cid) {
    return model.find({
        sid: sid,
        "config.channel": cid
    })
}

// Listando todos os triggers do servidor
async function listAllGuildVoiceTriggers(sid, active) {

    if (active)
        return model.find({
            sid: sid,
            "config.active": active
        }).sort({
            timestamp: 1
        })

    return model.find({
        sid: sid
    }).sort({
        timestamp: 1
    })
}

// Apaga o trigger customizado
async function dropGuildVoiceTrigger(sid, hash) {
    await model.findOneAndDelete({
        sid: sid,
        hash: hash
    })
}

// Apaga todos os triggers criados no servidor
async function dropAllGuildVoiceTriggers(sid) {
    await model.deleteMany({
        sid: sid
    })
}

async function updateTriggerChannels(client) {

    // Converte as configurações antigas de servidores com canais de voz para o novo sistema de triggers
    const guilds = await listAllVoicedGuilds()

    for (const guildData of guilds) {
        if (!await model.exists({ "sid": client.encrypt(guildData.sid) })) {

            const trigger = await model.create({
                sid: client.encrypt(guildData.sid),
                hash: randomString(15, client, true),
                timestamp: client.execute("timestamp")
            })

            trigger.config.channel = guildData.voice_channels.channel
            trigger.config.category = guildData.voice_channels.category
            trigger.config.preferences.user_limit = guildData.voice_channels.preferences.user_limit
            trigger.config.preferences.allow_text = guildData.voice_channels.preferences.allow_text
            trigger.config.preferences.always_private = guildData.voice_channels.preferences.always_private

            await trigger.save()
        }
    }
}

module.exports.Voice_trigger = model
module.exports = {
    getGuildVoiceTrigger,
    getVoiceTriggerByChannelId,
    listAllGuildVoiceTriggers,
    dropGuildVoiceTrigger,
    verifyTwinTriggers,
    dropAllGuildVoiceTriggers,
    updateTriggerChannels
}