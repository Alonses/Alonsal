const LIMIT = 5
const DIFF = 5000
const CALDEIRA = 60000

module.exports = async ({ client, message, caso }) => {

    //            Comandos            Mensagens
    let id_alvo = message.user?.id || message.author?.id

    // Coletando os dados do usuário alvo
    let user = await client.getUserRankServer(id_alvo, message.guild.id)
    user = user[0]

    // Validando se o usuário tem o ranking habilitado
    if (!await client.userRanking(user.uid)) return

    //              Comandos                  Mensagens
    user.nickname = message.user?.username || message.author?.username

    if (caso === "messages")
        if (user.warns >= LIMIT) {
            user.caldeira_de_ceira = true
            user.warns = 0

            await user.save()
            return
        }

    // Limitando o ganho de XP por span no chat
    if (user.caldeira_de_ceira) {
        if (message.createdTimestamp - user.lastValidMessage > CALDEIRA)
            user.caldeira_de_ceira = false
        else if (caso === "messages") return
    }

    if (caso === "messages")
        if (message.createdTimestamp - user.lastValidMessage < DIFF) {
            user.warns++

            await user.save()
            return
        }

    // Coletando o XP atual e somando ao total do usuário
    const bot = await client.getBot()

    if (caso === "messages") {
        user.xp += bot.persis.ranking
        user.lastValidMessage = message.createdTimestamp
        user.warns = 0
    } else // Experiência obtida executando comandos
        user.xp += bot.persis.ranking * 1.5

    // Registrando no relatório algumas informações
    require('../automaticos/relatorio')({ client, caso })

    await user.save()
}