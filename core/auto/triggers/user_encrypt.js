const { encryptUserRankServers, listAllUserRankGuild } = require('../../database/schemas/User_rank_guild.js')
const { encryptUserGuild } = require('../../database/schemas/User_guilds.js')
const { encryptUserWarns } = require('../../database/schemas/User_warns.js')
const { encryptUserStrikes } = require('../../database/schemas/User_strikes.js')
const { encryptUserRoles } = require('../../database/schemas/User_roles.js')
const { encryptUserReport } = require('../../database/schemas/User_reports.js')
const { encryptUserPreWarn } = require('../../database/schemas/User_pre_warns.js')

async function atualiza_user_encrypt(client, user_id, new_user_id) {

    // Atualizando os IDs de referência para todas as tabelas do usuário

    // Atualizando os servidores vinculados ao usuário
    encryptUserGuild(user_id, new_user_id)

    // Atualizando os ranks de servidores do usuário
    encryptUserRankServers(user_id, new_user_id)

    // Atualizando todas as advertências do usuário
    encryptUserWarns(user_id, new_user_id)

    // Atualizando todos os strikes do usuário
    encryptUserStrikes(user_id, new_user_id)

    // Atualizando todos os cargos temporários do usuário
    encryptUserRoles(user_id, new_user_id)

    // Atualizando todos os reports do usuário
    encryptUserReport(user_id, new_user_id)

    // Atualizando todos as pre advertências do usuário
    encryptUserPreWarn(user_id, new_user_id)

    // Atualizações secundárias
    // Atualizando todos os dados restantes relacionados ao ranking por servidor do usuário
    const user_ranked_guilds = await listAllUserRankGuild(new_user_id)
    user_ranked_guilds.forEach(async user_guild_data => {
        user_guild_data.sid = client.encrypt(user_guild_data.sid)
        user_guild_data.nickname = client.encrypt(user_guild_data.nickname)

        await user_guild_data.save()
    })

    // Atualizando todos os dados restantes relacionados ao ranking global do usuário
    // const user_global_rank = await findUserGlobalRankIndex(new_user_id)

    // Criptografando o ID do servidor com maior XP do usuário
    // if (user_global_rank.sid) user_global_rank.sid = client.encrypt(user_global_rank.sid)

    // user_global_rank.nickname = client.encrypt(user_global_rank.nickname)
    // await user_global_rank.save()
}

module.exports.atualiza_user_encrypt = atualiza_user_encrypt