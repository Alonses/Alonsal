const fs = require('fs')

const { writeFileSync } = require('fs')

const { getOutdatedUsers, dropUser } = require('../../database/schemas/User.js')
const { dropAllUserTasks, dropAllGuildUserTasks } = require('../../database/schemas/User_tasks.js')
const { dropAllUserGroups, dropAllGuildUserGroups } = require('../../database/schemas/User_tasks_group.js')
const { dropAllUserBadges } = require('../../database/schemas/User_badges.js')
const { dropAllUserGuildRanks, getGuildOutdatedUsers, dropUserRankServer } = require('../../database/schemas/User_rank_guild.js')
const { dropUserGlobalRank } = require('../../database/schemas/User_rank_guild.js')
const { dropAllUserModules } = require('../../database/schemas/User_modules.js')
const { dropAllUserStatements } = require('../../database/schemas/User_statements.js')
const { dropAllUserTickets, dropTicket } = require('../../database/schemas/User_tickets.js')
const { dropAllUserGuilds, dropUserGuild } = require('../../database/schemas/User_guilds.js')

async function atualiza_user_eraser(client) {

    let dados = await getOutdatedUsers(client.timestamp())

    // Atualizando o status de exclusão do usuário
    for (let i = 0; i < dados.length; i++) {

        const usuario = dados[i]

        if (!usuario.erase.valid) { // Avisando sobre a atualização de status para exclusão dos dados do usuário
            usuario.erase.valid = true
            await usuario.save()
        }
    }

    // Salvando os usuários marcados para exclusão no cache do bot
    writeFileSync("./files/data/erase_user.txt", JSON.stringify(dados))

    dados = await getGuildOutdatedUsers(client.timestamp())

    // Atualizando o status de exclusão por servidor para o usuário
    for (let i = 0; i < dados.length; i++) {

        const usuario = dados[i]
        const guild = await client.guilds(usuario.sid)
        let nome_servidor

        if (guild)
            nome_servidor = `\`${usuario.sid}\` | \`${guild.name}\``
        else
            nome_servidor = `\`${usuario.sid}\` | \`${client.tls.phrase(usuario, "manu.data.server_desconhecido")}\``

        if (!usuario.erase.valid) { // Avisando sobre a atualização de status para exclusão dos dados do usuário
            usuario.erase.valid = true
            await usuario.save()
        }
    }

    // Salvando os usuários marcados para exclusão no cache do bot
    writeFileSync("./files/data/erase_user_guild.txt", JSON.stringify(dados))
}

async function verifica_user_eraser(client) {

    fs.readFile('./files/data/erase_user.txt', 'utf8', async (err, data) => {

        data = JSON.parse(data)

        // Interrompe a operação caso não haja advertências salvas em cache
        if (data.length < 1) return

        for (let i = 0; i < data.length; i++) {

            const usuario = data[i]
            const id_user = usuario.uid

            // Apenas realiza a ação após 2 semanas após usuário ser movido para exclusão
            if (client.timestamp() > (usuario.erase.erase_on + 1209600)) {

                // Excluindo todas as tarefas e grupos relacionadas ao usuário
                await dropAllUserTasks(id_user)
                await dropAllUserGroups(id_user)

                // Excluindo todas as badges que estão vinculadas ao usuário
                await dropAllUserBadges(id_user)

                // Excluindo todos os rankings globais e de servidores que fazem referência ao usuário
                await dropAllUserGuildRanks(id_user)
                await dropUserGlobalRank(id_user)

                // Excluindo todos os módulos do usuário
                await dropAllUserModules(id_user)

                // Excluindo o histórico de transações bancárias do usuário
                await dropAllUserStatements(id_user)

                // Excluindo todos os tickets criados por um usuário
                await dropAllUserTickets(id_user)

                // Excluindo todos os servidores salvos em cache do usuário
                await dropAllUserGuilds(id_user)

                // Exclui o usuário por completo
                await dropUser(id_user)
            }
        }

        // Atualizando as solicitações de exclusão em cache
        atualiza_user_eraser(client)
    })

    // Verificando os usuários movidos para exclusão por servidor
    fs.readFile('./files/data/erase_user_guild.txt', 'utf8', async (err, data) => {

        data = JSON.parse(data)

        // Interrompe a operação caso não haja advertências salvas em cache
        if (data.length < 1) return

        for (let i = 0; i < data.length; i++) {

            const usuario = data[i]
            const id_user = usuario.uid, id_guild = usuario.sid

            // Apenas realiza a ação após 1 semana do usuário ser movido para exclusão no servidor
            if (client.timestamp() > (usuario.erase.erase_on + 604800)) {

                // Excluindo todas as tarefas e grupos relacionadas ao usuário no servidor
                await dropAllGuildUserGroups(id_user, id_guild)
                await dropAllGuildUserTasks(id_user, id_guild)

                // Excluindo o ranking do servidor que faz referência ao usuário
                await dropUserRankServer(id_user, id_guild)

                // Excluindo o ticket criado pelo usuário no servidor
                await dropTicket(id_user, id_guild)

                // Excluindo o servidor salvo em cache do usuário
                await dropUserGuild(id_user, id_guild)
            }
        }

        // Atualizando as solicitações de exclusão em cache
        atualiza_user_eraser(client)
    })
}

module.exports.atualiza_user_eraser = atualiza_user_eraser
module.exports.verifica_user_eraser = verifica_user_eraser