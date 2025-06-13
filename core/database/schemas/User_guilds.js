const mongoose = require("mongoose")

// uid -> User ID
// sid -> Server ID

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    sid: { type: String, default: null }
})

const model = mongoose.model("User_guild", schema)

async function registerUserGuild(uid, sid) {
    if (!await model.exists({ uid: uid, sid: sid }))
        await model.create({
            uid: uid,
            sid: sid
        })
}

async function encryptUserGuild(uid, new_user_id) {

    await model.updateMany(
        { uid: uid },
        {
            $set: {
                uid: new_user_id
            }
        }
    )
}

async function listAllUserGuilds(uid) {
    return model.find({
        uid: uid
    })
}

// Remove o registro de um servidor do usuário
async function dropUserGuild(uid, sid) {
    if (await model.exists({ uid: uid, sid: sid }))
        await model.findOneAndDelete({
            uid: uid,
            sid: sid
        })
}

// Remove todos os registros com o servidor informado
async function dropAllUserGuilds(sid) {

    await model.deleteMany({
        sid: sid
    })
}

async function updateUserGuilds(client) {

    const guilds = await model.find()
    timedUpdate(client, guilds)
}

async function timedUpdate(client, guilds) {

    if (guilds.length > 0) {

        const guild = guilds[0]
        let atualizado = false

        if (guild.uid.length < 20) {
            guild.uid = client.encrypt(guild.uid)
            atualizado = true
        }

        if (guild.sid.length < 20) {
            guild.sid = client.encrypt(guild.sid)
            atualizado = true
        }

        if (guild.uid.length > 80) {
            guild.uid = client.decifer(guild.uid)
            atualizado = true
        }

        if (guild.sid.length > 80) {
            guild.sid = client.decifer(guild.sid)
            atualizado = true
        }

        if (atualizado) {
            console.log("atualizado", guild)
            await guild.save()
        }

        if (guilds.length % 50 == 0) console.log("Restam:", guilds.length)
        guilds.shift()

        setTimeout(() => {
            timedUpdate(client, guilds)
        }, 10)
    } else
        console.log("Finalizado")
}

module.exports.User_guild = model
module.exports = {
    registerUserGuild,
    listAllUserGuilds,
    dropUserGuild,
    dropAllUserGuilds,
    encryptUserGuild,
    updateUserGuilds
}