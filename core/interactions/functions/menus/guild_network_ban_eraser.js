const { getNetworkedGuilds } = require('../../../database/schemas/Guild')

module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    const network_guilds = await getNetworkedGuilds(guild.network.link)

    // Sincronizando os servidores com o novo tempo de exclusão para banimentos
    for (let i = 0; i < network_guilds.length; i++) {
        network_guilds[i].network.erase_ban_messages = parseInt(dados)
        network_guilds[i].save()
    }

    const pagina_guia = 1 // Redirecionando o evento
    require('../../chunks/panel_guild_network')({ client, user, interaction, pagina_guia })
}