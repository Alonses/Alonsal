const { encryptUserTasks, listAllUserTasks } = require('../../database/schemas/User_tasks.js')
const { encryptUserGroups, listAllUserGroups } = require('../../database/schemas/User_tasks_group.js')
const { encryptUserBadges } = require('../../database/schemas/User_badges.js')
const { encryptUserRankServers, listAllUserRankGuild } = require('../../database/schemas/User_rank_guild.js')
const { encryptUserModules } = require('../../database/schemas/User_modules.js')
const { encryptUserStatements } = require('../../database/schemas/User_statements.js')
const { encryptUserTicket } = require('../../database/schemas/User_tickets.js')
const { encryptUserGuild } = require('../../database/schemas/User_guilds.js')
const { encryptUserRankGlobal, findUserGlobalRankIndex } = require('../../database/schemas/User_rank_global.js')
const { encryptUserWarns } = require('../../database/schemas/User_warns.js')
const { encryptUserStrikes } = require('../../database/schemas/User_strikes.js')
const { encryptUserRoles } = require('../../database/schemas/User_roles.js')
const { encryptUserReport } = require('../../database/schemas/User_reports.js')
const { encryptUserPreWarn } = require('../../database/schemas/User_pre_warns.js')

async function atualiza_user_encrypt(client, user_id, new_user_id) {

    // Atualizando os IDs de referência para todas as tabelas do usuário

    // Atualizando os servidores vinculados ao usuário
    encryptUserGuild(user_id, new_user_id)

    // Atualizando o rank global do usuário
    encryptUserRankGlobal(user_id, new_user_id)

    // Atualizando os ranks de servidores do usuário
    encryptUserRankServers(user_id, new_user_id)

    // Atualizando os tickets criados pelo usuário
    encryptUserTicket(user_id, new_user_id)

    // Atualizando as movimentações de bufunfas do usuário
    encryptUserStatements(user_id, new_user_id)

    // Atualizando os módulos do usuário
    encryptUserModules(user_id, new_user_id)

    // Atualizando as badges do usuário
    encryptUserBadges(user_id, new_user_id)

    // Atualizando as listas de tarefas do usuário
    encryptUserGroups(user_id, new_user_id)

    // Atualizando as tarefas do usuário
    encryptUserTasks(user_id, new_user_id)

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
    const user_global_rank = await findUserGlobalRankIndex(new_user_id)

    // Criptografando o ID do servidor com maior XP do usuário
    // if (user_global_rank.sid) user_global_rank.sid = client.encrypt(user_global_rank.sid)

    user_global_rank.nickname = client.encrypt(user_global_rank.nickname)
    await user_global_rank.save()

    // Atualizando todos os dados relacionados as tarefas criadas pelo usuário
    const user_tasks = await listAllUserTasks(new_user_id)
    user_tasks.forEach(async task => {
        task.sid = client.encrypt(task.sid)
        task.text = client.encrypt(task.text)

        await task.save()
    })

    // Atualizando todos os dados relacionados as listas de tarefas criadas pelo usuário
    const user_tasks_lists = await listAllUserGroups(new_user_id)
    user_tasks_lists.forEach(async task_list => {
        task_list.sid = client.encrypt(task_list.sid)
        task_list.name = client.encrypt(task_list.name)

        await task_list.save()
    })
}

module.exports = {
    atualiza_user_encrypt
}