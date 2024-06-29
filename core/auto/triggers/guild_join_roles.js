const { getActiveRoleAssigner } = require('../../database/schemas/Guild_role_assigner.js')

async function atualiza_join_guilds(client) {

    const dados = await getActiveRoleAssigner("join")

    // Salvando os servidores com cargos de entrada ativos
    dados.forEach(guilds => { client.cached.join_guilds.set(guilds.sid, true) })
}

module.exports.atualiza_join_guilds = atualiza_join_guilds