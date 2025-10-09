const mongoose = require("mongoose")

const { randomString } = require("../../functions/random_string")
const { listAllVoicedGuilds } = require("./Guild")

// sid -> Server ID

const schema = new mongoose.Schema({
    sid: { type: String, default: null },
    hash: { type: String, default: null },
    timestamp: { type: Number, default: null },
    config: {
        active: { type: Boolean, default: true },
        channel: { type: String, default: null },
        category: { type: String, default: null },
        category_nick: { type: String, default: null },
        preferences: {
            user_limit: { type: Number, default: 0 },
            allow_text: { type: Boolean, default: false },
            always_private: { type: Boolean, default: false },
            voice_names: { type: String, default: "nicknames" }
        }
    }
})

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

    if (!await model.exists({ sid: sid, hash: hash })) {
        await model.create({
            sid: sid,
            hash: hash,
            timestamp: client.timestamp()
        })
    }

    return model.findOne({
        sid: sid,
        hash: hash
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
                timestamp: client.timestamp()
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