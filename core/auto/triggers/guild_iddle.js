const { listAllGuilds, dropGuild } = require("../../database/schemas/Guild")

async function servidores_inativos(client) {

    const guilds = await listAllGuilds()

    // Verificando os servidores onde o bot expirou o prazo de inatividade
    guilds.forEach(guild => {

        if (guild.iddle.timestamp)
            if (client.timestamp() > guild.iddle.timestamp) {

                // Saindo do servidor com inatividade confirmada
                client.discord.guilds.cache.get(guild.sid).leave()
                    .catch(async (err) => {

                        // Excluir a guild desconhecida do banco de dados
                        await dropGuild(guild.sid)
                    })
            }
    })
}

module.exports.servidores_inativos = servidores_inativos