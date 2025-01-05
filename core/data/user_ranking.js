const { atualiza_user_eraser } = require('../auto/triggers/user_eraser')
const { getUserGlobalRank } = require('../database/schemas/User_rank_global')
const { getUserRankServer, getUserRankServers } = require('../database/schemas/User_rank_guild')

const { CHECKS } = require('../formatters/patterns/user')
const { defaultUserEraser } = require('../formatters/patterns/timeout')

let members_xp = []

module.exports = async ({ client, message, caso }) => {

    //            Comandos            Mensagens
    let id_alvo = message.user?.id || message.author?.id
    let cached_erase = false

    const user_data = await client.getUser(id_alvo) // Salvando a última interação do usuário

    if (user_data.erase.forced)
        return // Usuário forçou a exclusão de dados

    if (user_data.erase.valid) { // Usuário interagiu com o Alonsal novamente
        // client.sendDM(user_data, { content: client.tls.phrase(user_data, "manu.data.aviso_remocao_exclusao", client.defaultEmoji("person")) })

        user_data.erase.valid = false // Retirando a etiqueta para remoção de dados
        cached_erase = true
    }

    user_data.erase.erase_on = client.timestamp() + defaultUserEraser[user_data.erase.timeout]

    // Ignora a interação caso não tenha sido acionado em um servidor
    if (!message.guild) {

        await user_data.save()
        return
    }

    // Coletando os dados do usuário alvo
    let guild_user = await getUserRankServer(client.encrypt(id_alvo), client.encrypt(message.guild.id))

    if (guild_user.erase.valid) { // Usuário interagiu com o Alonsal novamente
        // client.sendDM(user_data, { content: client.tls.phrase(user_data, "manu.data.aviso_remocao_exclusao_servidor", client.defaultEmoji("person"), await (client.guilds(message.guild.id)).name) })

        guild_user.erase.valid = false // Retirando a etiqueta para remoção de dados
        cached_erase = true
    }

    // Sincronizando o XP interno de todos os servidores que o usuário faz parte
    if (!guild_user.ixp) {
        guild_user.ixp = guild_user.xp
        await sincroniza_xp(guild_user)
    }

    if (cached_erase) // Atualizando a lista de usuários que estão marcados para exclusão
        atualiza_user_eraser(client)

    // Validando se o usuário tem o ranking habilitado
    if (!await client.verifyUserRanking(id_alvo)) return

    //              Comandos                  Mensagens
    guild_user.nickname = message.user?.username || message.author?.username
    guild_user.nickname = client.encrypt(guild_user.nickname)

    // Limitando o ganho de XP por spam no chat
    if (guild_user.caldeira_de_ceira)
        if (message.createdTimestamp - guild_user.lastInteraction > CHECKS.HOLD)
            guild_user.caldeira_de_ceira = false
        else if (caso === "messages") return

    if (caso === "messages") {
        if (guild_user.warns >= CHECKS.LIMIT) {
            guild_user.caldeira_de_ceira = true
            guild_user.warns = 0

            validador = true
            await guild_user.save()
            await user_data.save()

            return
        }

        if (message.createdTimestamp - guild_user.lastInteraction < CHECKS.DIFF) {
            guild_user.warns++

            await guild_user.save()
            await user_data.save()

            return
        }
    }

    // Coletando o XP atual e somando ao total do usuário
    let xp_anterior = guild_user.ixp

    // Recalculando o tempo de inatividade do usuário
    guild_user.erase.erase_on = client.timestamp() + defaultUserEraser[user_data.erase.guild_timeout]

    // Verificando se o servidor da interação está com o ranking habilitado
    if (client.cached.ranked_guilds.has(client.encrypt(message.guild.id))) {
        if (caso === "messages") {

            guild_user.xp += client.cached.ranking_value
            guild_user.ixp += client.cached.ranking_value

            guild_user.lastInteraction = message.createdTimestamp
            guild_user.warns = 0
        } else if (caso === "comando") { // Experiência obtida executando comandos
            guild_user.xp += client.cached.ranking_value * 1.5
            guild_user.ixp += client.cached.ranking_value * 1.5
        } else { // Experiência obtida ao usar botões ou menus
            guild_user.xp += client.cached.ranking_value * 0.5
            guild_user.ixp += client.cached.ranking_value * 0.5
        }
    }

    // Bônus em Bufunfas por subir de nível
    if (parseInt(guild_user.ixp / 1000) !== parseInt(xp_anterior / 1000)) {

        user_data.misc.money += 250
        await user_data.save()

        // Registrando as movimentações de bufunfas para o usuário
        client.registryStatement(user_data.uid, "misc.b_historico.nivel", true, 250)
        client.journal("gerado", 250)
    }

    // Registrando no relatório algumas informações
    client.journal(caso)
    await guild_user.save()

    // Adicionando o usuário na fila de ranking global para a próxima sincronização
    if (!members_xp.includes(guild_user.uid)) members_xp.push(guild_user.uid)
}

sincroniza_xp = async (guild_user) => {

    const servidores = await getUserRankServers(guild_user.uid)

    servidores.forEach(async servidor => {
        servidor.ixp = servidor.xp

        await servidor.save()
    })
}

async function verifica_servers() {

    let array_copia = members_xp
    members_xp = []

    if (array_copia.length > 0) // Sincronizando todos os rankings globais dos usuários que ganharam XP nos últimos 10min
        for (let i = 0; i < array_copia.length; i++) {

            id_user = array_copia[i]

            /* Verifica todos os servidores em busca do servidor com maior XP
            e salvando o maior servidor válido no ranking global */
            const servers = await getUserRankServers(id_user)
            let user_global = await getUserGlobalRank(id_user), maior = 0

            if (servers) {
                servers.forEach(async servidor => {
                    if (servidor.ixp > maior) {
                        maior = servidor.ixp

                        user_global.xp = servidor.ixp
                        user_global.sid = servidor.sid
                    }
                })

                await user_global.save()
            }

            array_copia.shift()
        }
}

module.exports.verifica_servers = verifica_servers