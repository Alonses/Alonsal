const { getNetworkedGuilds } = require("../database/schemas/Guild")

module.exports = async ({ client, data }) => {

    // Lista todos os servidores que estão no link do Network informado
    const servers_link = []
    const { user, link, interaction, ignore } = data

    let servers_cache = await getNetworkedGuilds(link)
    for (let i = 0; i < servers_cache.length; i++) {

        if (ignore) { // Ignora a guild onde a interação foi feita
            if (servers_cache[i].sid !== interaction.guild.id)
                servers_link.push(`\`${(await client.guilds(servers_cache[i].sid))?.name || client.tls.phrase(user, "menu.invalid.servidor_desconhecido")}\``)
        } else // Lista todas as guilds que estão no link
            servers_link.push(`\`${(await client.guilds(servers_cache[i].sid))?.name || client.tls.phrase(user, "menu.invalid.servidor_desconhecido")}\``)
    }

    return client.execute("list", { valores: servers_link, max: 500 })
}