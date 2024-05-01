const { createNetworkLink } = require('../../../database/schemas/Guild_network')

module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)

    if (!guild.network.link) // Criando um link de network para o servidor
        guild.network.link = await createNetworkLink(client)

    // Atualizando o link dos servidores
    for (let i = 0; i < interaction.values.length; i++) {

        const internal_guild = await client.getGuild(interaction.values[i].split("|")[1])

        // Desvinculando o servidor
        if (internal_guild.network.link === guild.network.link) {
            internal_guild.conf.network = false
            internal_guild.network.link = null
        } else { // Vinculando o servidor
            internal_guild.conf.network = true
            internal_guild.network.link = guild.network.link
        }

        await internal_guild.save()
    }

    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_network')({ client, user, interaction })
}