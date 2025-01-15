const { listAllGuilds, dropGuild } = require("../../database/schemas/Guild")

async function servidores_inativos(client) {

    const guilds = await listAllGuilds()
    let lista_servidores = []

    // Verificando os servidores onde o bot expirou o prazo de inatividade
    guilds.forEach(guild => {

        if (guild.iddle.timestamp)
            if (client.timestamp() > guild.iddle.timestamp && !guild.inviter && !guild.conf.games && !guild.network.link) {

                // Saindo do servidor com inatividade confirmada
                const cached_guild = client.discord.guilds.cache.get(guild.sid)

                if (cached_guild)
                    lista_servidores.push(cached_guild)
            }
    })

    // Aviso sobre desconectamento enviado ao chat de feeds 
    if (lista_servidores.length > 0) {
        let texto = `:globe_with_meridians: :zzz: | Desconectando de \`1 servidor\` considerado inativo.`

        if (lista_servidores.length > 1)
            texto = `:globe_with_meridians: :zzz: | Desconectando de \`${lista_servidores.length} servidores\` considerados inativos.`

        client.notify(process.env.channel_feeds, { content: texto })

        disconnect_iddle_guilds(lista_servidores)
    }
}

async function disconnect_iddle_guilds(servers) {

    const guild = servers[0]

    // Desconectando da guild inativa
    await guild.leave()
        .catch(async (err) => {

            // Excluir a guild desconhecida do banco de dados
            await dropGuild(guild.sid)
        })

    servers.shift()

    if (servers.length > 0)
        setTimeout(() => {
            disconnect_iddle_guilds(servers)
        }, 1000)
}

module.exports.servidores_inativos = servidores_inativos