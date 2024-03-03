const fs = require('fs')

const { writeFileSync } = require('fs')

const { getOutdatedUsers, dropUser } = require('../database/schemas/User.js')
const { dropAllUserTasks } = require('../database/schemas/Task.js')
const { dropAllUserGroups } = require('../database/schemas/Task_group.js')
const { dropAllUserBadges } = require('../database/schemas/Badge.js')
const { dropAllUserGuildRanks } = require('../database/schemas/Rank_s.js')
const { dropUserGlobalRank } = require('../database/schemas/Rank_g.js')
const { dropAllUserModules } = require('../database/schemas/Module.js')
const { dropAllUserStatements } = require('../database/schemas/Statement.js')
const { dropAllUSerTickets } = require('../database/schemas/Tickets.js')
const { dropAllUserGuilds } = require('../database/schemas/User_guilds.js')

async function atualiza_user_eraser(client) {

    const dados = await getOutdatedUsers(client.timestamp())

    // Atualizando o status de exclusão do usuário
    for (let i = 0; i < dados.length; i++) {

        const usuario = dados[i]

        usuario.erase.erase_on + 1209600

        if (!usuario.erase.valid) { // Avisando sobre a atualização de status para exclusão dos dados do usuário
            client.notify(process.env.channel_data, { content: `${client.defaultEmoji("person")} | Usuário ( \`${usuario.uid}\` ) marcado para exclusão dos dados.\nExcluindo <t:${usuario.erase.erase_on + 1209600}:R> ( <t:${usuario.erase.erase_on + 1209600}:f> )` })

            client.sendDM(usuario, { data: client.replace(client.tls.phrase(user, "manu.data.aviso_movido_exclusao_dm", client.defaultEmoji("person")), usuario.erase.erase_on + 1209600) })

            usuario.erase.valid = true
            await usuario.save()
        }
    }

    // Salvando os usuários marcados para exclusão no cache do bot
    writeFileSync("./files/data/erase_user.txt", JSON.stringify(dados))
}

async function verifica_user_eraser(client) {

    fs.readFile('./files/data/erase_user.txt', 'utf8', async (err, data) => {

        data = JSON.parse(data)

        // Interrompe a operação caso não haja advertências salvas em cache
        if (data.length < 1) return

        for (let i = 0; i < data.length; i++) {

            const usuario = data[i]
            const id_user = usuario.uid

            // Apenas realiza a ação após 2 semanas do usuário ser movido para exclusão
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
                await dropAllUSerTickets(id_user)

                // Excluindo todos os servidores salvos em cache do usuário
                await dropAllUserGuilds(id_user)

                // Exclui o usuário por completo
                await dropUser(id_user)

                client.notify(process.env.channel_data, { content: `${client.defaultEmoji("paper")} ${client.emoji(13)} | O usuário ( \`${id_user}\` ) e todos os dados relacionados foram excluídos com sucesso!` })
            }
        }

        // Atualizando as solicitações de exclusão em cache
        atualiza_user_eraser(client)
    })
}

module.exports.atualiza_user_eraser = atualiza_user_eraser
module.exports.verifica_user_eraser = verifica_user_eraser