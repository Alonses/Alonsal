const { atualiza_user_eraser } = require('../auto/triggers/user_eraser')
const { updateUserFields } = require('../database/schemas/User')
const { setUserGlobalRank, dropUserGlobalRank } = require('../database/schemas/User_rank_global')
const { getUserRankServer, getUserRankServers, applyRankServerUpdate, syncRankServersIxp } = require('../database/schemas/User_rank_guild')

const { CHECKS } = require('../formatters/patterns/user')
const { defaultUserEraser } = require('../formatters/patterns/timeout')

// Só regrava o tempo de inatividade quando a diferença passa de 1 hora
const ERASE_REFRESH = 3600

let members_xp = new Set()

/**
 * Atualiza e gerencia o ranking do usuário
 * Todas as gravações são atômicas ($set/$inc), evitando perda de XP em interações simultâneas
 */
module.exports = async ({ client, message, caso }) => {
    try {
        await registraExperiencia({ client, message, caso })
    } catch (err) {
        console.error("🛑 | Erro ao registrar experiência do usuário:", err)
    }
}

const registraExperiencia = async ({ client, message, caso }) => {

    // Registra no relatório diário o evento
    client.journal(caso, 1)

    // Cancela a operação caso o ranking esteja desligado
    if (!client.x.ranking) return

    // Identifica o usuário alvo
    const id_user = message.user?.id || message.author?.id
    let cached_erase = false

    const user_data = await client.execute("getUser", { id_user })
    const timestamp_atual = client.execute("timestamp")

    // Usuário forçou exclusão de dados
    if (user_data.erase.forced) return

    const user_set = {}

    // Usuário interagiu novamente, remove etiqueta de exclusão
    if (user_data.erase.valid) {
        user_set["erase.valid"] = false
        cached_erase = true
    }

    const user_erase_on = timestamp_atual + defaultUserEraser[user_data.erase.timeout]

    if (cached_erase || !user_data.erase.erase_on || user_erase_on - user_data.erase.erase_on >= ERASE_REFRESH)
        user_set["erase.erase_on"] = user_erase_on

    // Ignora se não foi acionado em um servidor
    if (!message.guild) {
        if (Object.keys(user_set).length) await updateUserFields(user_data.uid, user_set)
        return
    }

    // Dados do usuário no servidor
    const sid = client.encrypt(message.guild.id)
    const guild_user = await getUserRankServer(client.encrypt(id_user), sid)

    const guild_set = {}
    const guild_inc = {}

    // Usuário interagiu novamente no servidor, remove etiqueta de exclusão
    if (guild_user.erase.valid) {
        guild_set["erase.valid"] = false
        cached_erase = true
    }

    const guild_erase_on = timestamp_atual + defaultUserEraser[user_data.erase.guild_timeout]

    if (guild_user.erase.valid || !guild_user.erase.erase_on || guild_erase_on - guild_user.erase.erase_on >= ERASE_REFRESH)
        guild_set["erase.erase_on"] = guild_erase_on

    // Sincroniza XP interno de todos os servidores
    if (!guild_user.ixp && guild_user.xp > 0) {
        await syncRankServersIxp(guild_user.uid)
        guild_user.ixp = guild_user.xp
    }

    // Atualiza lista de usuários marcados para exclusão
    if (cached_erase) atualiza_user_eraser(client)

    // Verifica se o usuário tem ranking habilitado
    if (user_data.conf?.ranking === false) {
        await gravaPendentes(user_data.uid, user_set, guild_user.uid, sid, guild_set, guild_inc)
        return
    }

    // Atualiza nickname criptografado
    guild_set.nickname = client.encrypt(message.user?.username || message.author?.username)

    // Lógica de mensagens: controle de warns e spam
    if (caso === "messages") {
        if (guild_user.warns >= CHECKS.LIMIT) {
            guild_set.caldeira_de_ceira = true
            guild_set.warns = 0
            await gravaPendentes(user_data.uid, user_set, guild_user.uid, sid, guild_set, guild_inc)
            return
        }

        if ((message.createdTimestamp - guild_user.lastInteraction) < CHECKS.DIFF) {
            guild_inc.warns = 1
            await gravaPendentes(user_data.uid, user_set, guild_user.uid, sid, guild_set, guild_inc)
            return
        }
    }

    // Limita ganho de XP por spam
    if (guild_user.caldeira_de_ceira) {
        if (message.createdTimestamp - guild_user.lastInteraction > CHECKS.HOLD) {
            guild_set.caldeira_de_ceira = false
        } else if (caso === "messages") {
            await gravaPendentes(user_data.uid, user_set, guild_user.uid, sid, guild_set, guild_inc)
            return
        }
    }

    // Calcula o XP ganho, caso o servidor tenha o ranking habilitado
    let ganho = 0

    if (client.cached.ranked_guilds.has(sid)) {
        if (caso === "messages") {
            ganho = client.cached.ranking_value
            guild_set.lastInteraction = message.createdTimestamp
            guild_set.warns = 0
        } else if (caso === "comando") {
            ganho = client.cached.ranking_value * 1.5
        } else {
            ganho = client.cached.ranking_value * 0.5
        }

        guild_inc.xp = ganho
        guild_inc.ixp = ganho
    }

    const atualizado = await applyRankServerUpdate(guild_user.uid, sid, montaUpdate(guild_set, guild_inc))

    // Bônus por subir de nível, calculado sobre o valor já atualizado no banco
    const subiu_nivel = ganho && atualizado &&
        parseInt(atualizado.ixp / 1000) !== parseInt((atualizado.ixp - ganho) / 1000)

    if (subiu_nivel) {
        await updateUserFields(user_data.uid, user_set, { "misc.money": 250 })

        client.registryStatement(user_data.uid, "misc.b_historico.nivel", true, 250)
        client.journal("gerado", 250)
    } else if (Object.keys(user_set).length) {
        await updateUserFields(user_data.uid, user_set)
    }

    // Adiciona usuário na fila de ranking global para sincronização
    if (ganho) members_xp.add(guild_user.uid)
}

const montaUpdate = (set, inc) => {
    const update = {}

    if (Object.keys(set).length) update.$set = set
    if (Object.keys(inc).length) update.$inc = inc

    return update
}

// Grava as alterações pendentes do usuário e do servidor em paralelo
const gravaPendentes = async (uid, user_set, guild_uid, sid, guild_set, guild_inc) => {
    const tarefas = []
    const update = montaUpdate(guild_set, guild_inc)

    if (Object.keys(user_set).length) tarefas.push(updateUserFields(uid, user_set))
    if (update.$set || update.$inc) tarefas.push(applyRankServerUpdate(guild_uid, sid, update))

    await Promise.all(tarefas)
}

/**
 * Sincroniza rankings globais dos usuários que ganharam XP recentemente
 */
async function verifica_servers() {

    // Sem membros salvos na fila
    if (members_xp.size === 0) return

    // Copia e limpa a fila de usuários
    const array_copia = [...members_xp]
    members_xp = new Set()

    for (let i = 0; i < array_copia.length; i += 10) {
        await Promise.all(array_copia.slice(i, i + 10).map(async id_user => {
            try {
                await sincronizaRankGlobal(id_user)
            } catch (err) {
                // Mantém o usuário na fila para uma nova tentativa
                members_xp.add(id_user)
                console.error("🛑 | Erro ao sincronizar ranking global:", err)
            }
        }))
    }
}

const sincronizaRankGlobal = async (id_user) => {
    const servers = await getUserRankServers(id_user)
    if (!servers) return

    let maior = null

    for (const servidor of servers)
        if (!maior || servidor.ixp > maior.ixp) maior = servidor

    // Exclui usuário se XP global estiver zerado
    if (!maior || !maior.ixp) return dropUserGlobalRank(id_user)

    await setUserGlobalRank(id_user, maior.ixp, maior.sid, maior.nickname)
}

module.exports.verifica_servers = verifica_servers
