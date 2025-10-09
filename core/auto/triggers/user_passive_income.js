const { getUsersWithActiveSubscription } = require("../../database/schemas/User")
const { week_days } = require("../../formatters/patterns/user")

async function verifica_renda_passiva(client) {

    const users = await getUsersWithActiveSubscription()
    const data1 = new Date().getDay()

    // Fazendo as Bufunfas dos assinantes render em dias úteis
    for (const user of users) {
        if (week_days[0][data1]) {

            const rendimento = user.misc.money * 0.00038
            user.misc.money += rendimento

            user.misc.money = Number.parseFloat(user.misc.money).toFixed(4)
            await user.save()

            client.registryStatement(user.uid, "misc.b_historico.daily_rendimento", true, Number.parseFloat(rendimento).toFixed(4))
            await client.journal("gerado", Number.parseFloat(rendimento).toFixed(4))
        }
    }
}

module.exports.verifica_renda_passiva = verifica_renda_passiva