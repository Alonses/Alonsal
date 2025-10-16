const { checkUserGuildWarned } = require("../database/schemas/User_warns")
const { checkUserGuildPreWarned } = require("../database/schemas/User_pre_warns")

module.exports = async ({ client, data }) => {

    if (!data?.escopo) {
        console.error("🛑 | Escopo não informado ao solicitar um rascunho de advertência do usuário")
        console.trace()
        process.exit(1)
    }

    const id_guild = data.id_guild
    const escopo = data.escopo

    const warned_users = await (escopo === "warn" ? checkUserGuildWarned(id_guild) : checkUserGuildPreWarned(id_guild)), usuarios_validos = []
    let warned_cache = []

    for (let i = 0; i < warned_users.length; i++)
        if (!warned_cache.includes(warned_users[i].uid)) {
            warned_cache.push(warned_users[i].uid)
            usuarios_validos.push(warned_users[i])
        }

    return usuarios_validos
}