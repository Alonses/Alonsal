const { dropAllUserModules } = require("../database/schemas/Module")
const { dropUserGlobalRank } = require("../database/schemas/Rank_g")
const { dropUnknownRankServers, dropUserRankServer } = require("../database/schemas/Rank_s")
const { dropAllUserStatements } = require("../database/schemas/Statement")
const { dropAllUserTasks } = require("../database/schemas/Task")
const { dropAllUserGroups } = require("../database/schemas/Task_group")

const combo_relation = {
    "1": [1, 2],
    "2": [3, 4],
    "3": [5, 6, 7],
    "4": [8, 9],
    "5": [10],
    "6": [11]
}

function update_data(user) {

    if (user.badges)
        delete user.badges

    if (user.conquistas)
        delete user['conquistas']

    if (user.misc?.ghost_mode)
        delete user['misc']['ghost_mode']

    return user
}

async function clear_data({ client, user, interaction, operador, caso }) {

    // Atualizando os dados do usuário
    user = await update_data(user)
    let value = caso

    // Limpa os dados conforme o nível de escolha do usuário
    while (value > 0) {

        let alvos = [value]

        if (operador === "combo")
            alvos = combo_relation[value]

        for (let i = 0; i < alvos.length; i++) {

            if (alvos[i] === 1) // Excluindo o local padrão do comando /tempo
                user.misc.locale = null

            if (alvos[i] === 2) { // Excluindo as redes sociais vinculadas
                user.social.steam = null
                user.social.lastfm = null
                user.social.pula_predios = null
            }

            if (alvos[i] === 3) { // Excluindo as cores dos embeds
                user.misc.color = "#29BB8E"
                user.misc.embed = "#29BB8E"
            }

            if (alvos[i] === 4) // Removendo a badge fixada
                user.misc.fixed_badge = null

            if (alvos[i] === 5)  // Excluindo o rank de servidores desconhecidos
                dropUnknownRankServers(user.uid)

            if (alvos[i] === 6) // Excluindo o rank do servidor
                dropUserRankServer(user.uid, interaction.guild.id)

            if (alvos[i] === 7) // Excluindo o rank global
                dropUserGlobalRank(user.uid)

            if (alvos[i] === 8) { // Excluindo todas as tarefas e listas de tarefas
                dropAllUserTasks(user.uid)
                dropAllUserGroups(user.uid)
            }

            if (alvos[i] === 9) // Excluindo todos os módulos
                dropAllUserModules(user.uid)

            if (alvos[i] === 10) { // Zerando as bufunfas do usuário e limpando o histórico de movimentações
                user.misc.money = 0
                dropAllUserStatements(user.uid)
            }

            if (alvos[i] === 11) // Dados extras que podem ser excluídos
                user.misc.weather = true
        }

        value--

        if (operador === "uni") // Interrompendo a repetição
            break
    }

    await user.save()

    client.tls.report(interaction, user, "manu.data.dados_excluidos", 1, 10, interaction.customId)
}

module.exports = {
    clear_data,
    update_data,
    combo_relation
}