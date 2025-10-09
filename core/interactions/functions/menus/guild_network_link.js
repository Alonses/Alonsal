const { getNetworkedGuilds } = require('../../../database/schemas/Guild')
const { createNetworkLink } = require('../../../database/schemas/Guild_network')

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id), networkLotado = []
    const limite_network = guild.misc.subscription.active ? 30 : 10

    if (!guild.network.link) { // Criando um link de network para o servidor
        guild.network.link = await createNetworkLink(client)
        await guild.save()
    }

    // Coletando todas as guilds que pertecem possuem o mesmo link de network
    let guildsNetwork = await (await getNetworkedGuilds(guild.network.link)).length
    const network = {
        add: [],
        remove: []
    }

    // Atualizando o link dos servidores
    for (let i = 0; i < interaction.values.length; i++) {

        const internal_guild = await client.getGuild(interaction.values[i].split("|")[1])

        // Filtrando os servidores informados
        if (internal_guild.network.link === guild.network.link) network.remove.push(internal_guild)
        else network.add.push(internal_guild)
    }

    // Removendo os servidores informados novamente antes para liberar espaço no network
    for (const guild of network.remove) {

        guild.conf.network = false
        guild.network.link = null
        await guild.save()

        guildsNetwork--
    }

    // Vinculando os servidores ao link do network
    for (const guild of network.add) {

        if (guildsNetwork < limite_network) {

            guild.conf.network = true
            guild.network.link = guild.network.link
            await guild.save()

            guildsNetwork++

        } else networkLotado.push((await client.guilds(guild.sid))?.name)
    }

    // Redirecionando o evento
    require('../../chunks/panel_guild_network')({ client, user, interaction, networkLotado })
}