const { atualiza_user_eraser } = require('../auto/user_eraser')
const { getUserGlobalRank } = require('../database/schemas/Rank_g')
const { getUser, defaultUserEraser } = require('../database/schemas/User')
const { getUserRankServer, getUserRankServers } = require('../database/schemas/Rank_s')

const CHECKS = {
    LIMIT: 5,
    DIFF: 10000,
    HOLD: 60000
}

module.exports = async ({ client, message, caso }) => {

    if (!client.x.ranking) return

    //            Comandos            Mensagens
    let id_alvo = message.user?.id || message.author?.id

    // Coletando os dados do usuário alvo
    let user = await getUserRankServer(id_alvo, message.guild.id)

    // Sincronizando o XP interno de todos os servidores que o usuário faz parte
    if (!user.ixp) {
        user.ixp = user.xp
        await sincroniza_xp(user)
    }

    let user_global = await getUserGlobalRank(id_alvo, user.ixp, user.nickname, message.guild.id)

    const user_data = await client.getUser(user.uid) // Salvando a última interação do usuário

    if (user_data.erase.forced)
        return // Usuário forçou a exclusão de dados

    let cached_erase = false

    if (user_data.erase.valid) { // Usuário interagiu com o Alonsal novamente
        client.sendDM(user_data, { content: client.tls.phrase(user_data, "manu.data.aviso_remocao_exclusao", client.defaultEmoji("person")) })

        user_data.erase.valid = false // Retirando a etiqueta para remoção de dados
        cached_erase = true
    }

    if (user.erase.valid) { // Usuário interagiu com o Alonsal novamente
        client.sendDM(user_data, { content: client.tls.phrase(user_data, "manu.data.aviso_remocao_exclusao_servidor", client.defaultEmoji("person"), await (client.guilds(message.guild.id)).name) })

        user.erase.valid = false // Retirando a etiqueta para remoção de dados
        cached_erase = true
    }

    user_data.erase.erase_on = client.timestamp() + defaultUserEraser[user_data.erase.timeout]
    await user_data.save()

    if (cached_erase) // Atualizando a lista de usuários que estão marcados para exclusão
        atualiza_user_eraser(client)

    // Validando se o usuário tem o ranking habilitado
    if (!await client.verifyUserRanking(user.uid)) return

    //              Comandos                  Mensagens
    user.nickname = message.user?.username || message.author?.username

    if (caso === "messages") {

        let validador = false

        if (user.warns >= CHECKS.LIMIT) {
            user.caldeira_de_ceira = true
            user.warns = 0

            validador = true
            await user.save()
        }

        if (user_global.warns > CHECKS.LIMIT) {
            user_global.caldeira_de_ceira = true
            user_global.warns = 0

            validador = true
            await user_global.save()
        }

        if (validador)
            return
    }

    // Limitando o ganho de XP por spam no chat
    if (user.caldeira_de_ceira)
        if (message.createdTimestamp - user.lastInteraction > CHECKS.HOLD)
            user.caldeira_de_ceira = false
        else if (caso === "messages") return

    if (user_global.caldeira_de_ceira)
        if (message.createdTimestamp - user_global.lastInteraction > CHECKS.HOLD)
            user_global.caldeira_de_ceira = false
        else if (caso === "messages") return

    if (caso === "messages") {

        let validador = false

        if (message.createdTimestamp - user.lastInteraction < CHECKS.DIFF) {
            user.warns++

            validador = true
            await user.save()
        }

        if (message.createdTimestamp - user_global.lastInteraction < CHECKS.DIFF) {
            user_global.warns++

            validador = true
            await user_global.save()
        }

        if (validador) return
    }

    // Coletando o XP atual e somando ao total do usuário
    const bot = await client.getBot()
    let xp_anterior = user.ixp

    // Recalculando o tempo de inatividade do usuário
    user.erase.erase_on = client.timestamp() + defaultUserEraser[user_data.erase.guild_timeout]

    if (caso === "messages") {

        user.xp += bot.persis.ranking
        user.ixp += bot.persis.ranking

        user.lastInteraction = message.createdTimestamp
        user.warns = 0

        user_global.xp += bot.persis.ranking
        user_global.lastInteraction = message.createdTimestamp
        user_global.warns = 0

    } else if (caso === "comando") { // Experiência obtida executando comandos
        user.xp += bot.persis.ranking * 1.5
        user.ixp += bot.persis.ranking * 1.5

        user_global.xp += bot.persis.ranking * 1.5
    } else { // Experiência obtida ao usar botões ou menus
        user.xp += bot.persis.ranking * 0.5
        user.ixp += bot.persis.ranking * 0.5

        user_global.xp += bot.persis.ranking * 0.5
    }

    // Bônus em Bufunfas por subir de nível
    if (parseInt(user.ixp / 1000) !== parseInt(xp_anterior / 1000)) {
        const internal_user = await getUser(id_alvo)

        internal_user.misc.money += 250
        await internal_user.save()

        // Registrando as movimentações de bufunfas para o usuário
        client.registryStatement(internal_user.uid, "misc.b_historico.nivel", true, 250)
        client.journal("gerado", 250)
    }

    // Registrando no relatório algumas informações
    client.journal(caso)
    verifica_servers(client, user, user_global)
}

verifica_servers = async (client, user, user_global) => {

    /* Verifica todos os servidores em busca do servidor com maior XP
    e salvando o maior servidor válido no ranking global */
    const servers = await getUserRankServers(user.uid)
    let maior = 0

    servers.forEach(servidor => {
        if (servidor.ixp > maior) {
            maior = servidor.ixp
            user_global.xp = servidor.ixp
            user_global.sid = servidor.sid
        }
    })

    await user.save()
    await user_global.save()
}

sincroniza_xp = async (user) => {

    const servidores = await getUserRankServers(user.uid)

    servidores.forEach(async servidor => {
        servidor.ixp = servidor.xp

        await servidor.save()
    })
}