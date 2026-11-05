const { getNetworkSids } = require("../database/schemas/Guild")

module.exports = async ({ client, data }) => {

    // Lista todos os servidores que estão no link do Network informado
    const { user, link, interaction, ignore } = data

    const sids = await getNetworkSids(link)
    const desconhecido = client.tls.phrase(user, "menu.invalid.servidor_desconhecido")

    const servers_link = sids
        .filter(sid => !ignore || sid !== interaction.guild.id) // Ignora a guild onde a interação foi feita
        .map(sid => `\`${client.guilds(sid)?.name || desconhecido}\``)

    return client.execute("list", { valores: servers_link, max: 500 })
}