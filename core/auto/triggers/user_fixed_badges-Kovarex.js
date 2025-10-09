const { getUsersWithFixedBadges } = require('../../database/schemas/User.js')

async function atualiza_fixed_badges(client) {

    const dados = await getUsersWithFixedBadges()

    // Salvando as badges fixadas no cache do bot
    client.cached.fixed_badges.clear()
    dados.forEach(user => { client.cached.fixed_badges.set(user.uid, user.misc.fixed_badge) })
}

module.exports.atualiza_fixed_badges = atualiza_fixed_badges