const { getUserGlobalRank } = require('../database/schemas/Rank_g')
const { getUserRankServer } = require('../database/schemas/Rank_s')

const LIMIT = 5
const DIFF = 5000
const CALDEIRA = 60000

module.exports = async ({ client, message, caso }) => {

    //            Comandos            Mensagens
    let id_alvo = message.user?.id || message.author?.id

    // Coletando os dados do usuário alvo
    let user = await getUserRankServer(id_alvo, message.guild.id)
    let user_global = await getUserGlobalRank(id_alvo, user.xp, user.nickname, message.guild.id)

    // Validando se o usuário tem o ranking habilitado
    if (!await client.userRanking(user.uid)) return

    //              Comandos                  Mensagens
    user.nickname = message.user?.username || message.author?.username

    if (caso === "messages") {

        let validador = false

        if (user.warns >= LIMIT) {
            user.caldeira_de_ceira = true
            user.warns = 0

            validador = true
            await user.save()
        }

        if (user_global.warns > LIMIT) {
            user_global.caldeira_de_ceira = true
            user_global.warns = 0

            validador = true
            await user_global.save()
        }

        if (validador)
            return
    }

    // Limitando o ganho de XP por span no chat
    if (user.caldeira_de_ceira) {
        if (message.createdTimestamp - user.lastValidMessage > CALDEIRA)
            user.caldeira_de_ceira = false
        else if (caso === "messages") return
    }

    if (user_global.caldeira_de_ceira) {
        if (message.createdTimestamp - user_global.lastValidMessage > CALDEIRA)
            user_global.caldeira_de_ceira = false
        else if (caso === "messages") return
    }

    if (caso === "messages") {

        let validador = false

        if (message.createdTimestamp - user.lastValidMessage < DIFF) {
            user.warns++

            validador = true
            await user.save()
        }

        if (message.createdTimestamp - user_global.lastValidMessage < DIFF) {
            user.warns++

            validador = true
            await user.save()
        }

        if (validador)
            return
    }

    // Coletando o XP atual e somando ao total do usuário
    const bot = await client.getBot()

    if (caso === "messages") {
        user.xp += bot.persis.ranking
        user.lastValidMessage = message.createdTimestamp
        user.warns = 0

        user_global += bot.persis.ranking
        user_global.lastValidMessage = message.createdTimestamp
        user_global.warns = 0

    } else { // Experiência obtida executando comandos
        user.xp += bot.persis.ranking * 1.5

        user_global.xp += bot.persis.ranking * 1.5
    }

    // Registrando no relatório algumas informações
    require('../automaticos/relatorio')({ client, caso })

    await user.save()
    await user_global.save()
}