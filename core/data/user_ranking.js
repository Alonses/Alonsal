const { atualiza_user_eraser } = require('../auto/triggers/user_eraser')
const { getUserGlobalRank } = require('../database/schemas/User_rank_global')
const { getUserRankServer, getUserRankServers } = require('../database/schemas/User_rank_guild')

const { CHECKS } = require('../formatters/patterns/user')
const { defaultUserEraser } = require('../formatters/patterns/timeout')

let members_xp = []

/**
 * Atualiza e gerencia o ranking do usuário
 */
module.exports = async ({ client, message, caso }) => {

    // Identifica o usuário alvo
    const id_alvo = message.user?.id || message.author?.id
    let cached_erase = false

    const user_data = await client.getUser(id_alvo)

    // Usuário forçou exclusão de dados
    if (user_data.erase.forced) return

    // Usuário interagiu novamente, remove etiqueta de exclusão
    if (user_data.erase.valid) {
        user_data.erase.valid = false
        cached_erase = true
    }

    user_data.erase.erase_on = client.timestamp() + defaultUserEraser[user_data.erase.timeout]

    // Ignora se não foi acionado em um servidor
    if (!message.guild) {
        await user_data.save()
        return
    }

    // Dados do usuário no servidor
    let guild_user = await getUserRankServer(client.encrypt(id_alvo), client.encrypt(message.guild.id))

    // Usuário interagiu novamente no servidor, remove etiqueta de exclusão
    if (guild_user.erase.valid) {
        guild_user.erase.valid = false
        cached_erase = true
    }

    // Sincroniza XP interno de todos os servidores
    if (!guild_user.ixp) {
        guild_user.ixp = guild_user.xp
        await sincroniza_xp(guild_user)
    }

    // Atualiza lista de usuários marcados para exclusão
    if (cached_erase) atualiza_user_eraser(client)

    // Verifica se o usuário tem ranking habilitado
    if (!await client.verifyUserRanking(id_alvo)) return

    // Atualiza nickname criptografado
    guild_user.nickname = message.user?.username || message.author?.username
    guild_user.nickname = client.encrypt(guild_user.nickname)

    // Lógica de mensagens: controle de warns e spam
    if (caso === "messages") {
        if (guild_user.warns >= CHECKS.LIMIT) {
            guild_user.caldeira_de_ceira = true
            guild_user.warns = 0
            await guild_user.save()
            await user_data.save()
            return
        }

        if ((message.createdTimestamp - guild_user.lastInteraction) < CHECKS.DIFF) {
            guild_user.warns++
            await guild_user.save()
            await user_data.save()
            return
        }
    }

    // Limita ganho de XP por spam
    if (guild_user.caldeira_de_ceira) {
        if (message.createdTimestamp - guild_user.lastInteraction > CHECKS.HOLD) {
            guild_user.caldeira_de_ceira = false
        } else if (caso === "messages") {
            return
        }
    }

    // Coleta XP anterior
    const xp_anterior = guild_user.ixp

    // Recalcula tempo de inatividade
    guild_user.erase.erase_on = client.timestamp() + defaultUserEraser[user_data.erase.guild_timeout]

    // Verifica se o servidor tem ranking habilitado
    if (client.cached.ranked_guilds.has(client.encrypt(message.guild.id))) {
        if (caso === "messages") {
            guild_user.xp += client.cached.ranking_value
            guild_user.ixp += client.cached.ranking_value
            guild_user.lastInteraction = message.createdTimestamp
            guild_user.warns = 0
        } else if (caso === "comando") {
            guild_user.xp += client.cached.ranking_value * 1.5
            guild_user.ixp += client.cached.ranking_value * 1.5
        } else {
            guild_user.xp += client.cached.ranking_value * 0.5
            guild_user.ixp += client.cached.ranking_value * 0.5
        }
    }

    // Bônus por subir de nível
    if (parseInt(guild_user.ixp / 1000) !== parseInt(xp_anterior / 1000)) {
        user_data.misc.money += 250
        await user_data.save()
        client.registryStatement(user_data.uid, "misc.b_historico.nivel", true, 250)
        client.journal("gerado", 250)
    }

    // Registra no relatório
    client.journal(caso)
    await guild_user.save()

    // Adiciona usuário na fila de ranking global para sincronização
    if (!members_xp.includes(guild_user.uid)) members_xp.push(guild_user.uid)
}

/**
 * Sincroniza XP interno do usuário em todos os servidores
 */
const sincroniza_xp = async (guild_user) => {
    const servidores = await getUserRankServers(guild_user.uid)

    for (const servidor of servidores) {
        servidor.ixp = servidor.xp
        await servidor.save()
    }
}

/**
 * Sincroniza rankings globais dos usuários que ganharam XP recentemente
 */
async function verifica_servers() {

    // Copia e limpa a fila de usuários
    const array_copia = [...members_xp]
    members_xp = []

    if (array_copia.length > 0) {
        for (const id_user of array_copia) {

            // Busca todos os servidores do usuário
            const servers = await getUserRankServers(id_user)
            let user_global = await getUserGlobalRank(id_user)
            let maior = 0

            if (servers && servers.length > 0) {
                for (const servidor of servers) {
                    if (servidor.ixp > maior) {
                        maior = servidor.ixp
                        user_global.xp = servidor.ixp
                        user_global.sid = servidor.sid
                    }
                }

                // Exclui usuário se XP global estiver zerado
                if (user_global.xp === 0)
                    await user_global.delete()
                else
                    await user_global.save()

            }
        }
    }
}

module.exports.verifica_servers = verifica_servers