const { getUsersWithActiveSubscription } = require('../../database/schemas/User.js')

async function atualiza_user_subscription(client) {

    const dados = await getUsersWithActiveSubscription()

    // Salvando os membros com assinatura ativa no cache do bot
    client.cached.subscribers.clear()
    dados.forEach(subscription => { client.cached.subscribers.set(subscription.uid, true) })
}

async function verifica_subscribers(client) {

    const dados = await getUsersWithActiveSubscription()
    const timestamp_atual = client.execute("timestamp")

    dados.forEach(async user => {

        // Desativando a assinatura do usuário
        if (user.misc.subscriber.expires && timestamp_atual > user.misc.subscriber.expires) {
            user.misc.subscriber.active = false
            await user.save()
        }
    })

    atualiza_user_subscription(client)
}

module.exports.atualiza_user_subscription = atualiza_user_subscription
module.exports.verifica_subscribers = verifica_subscribers