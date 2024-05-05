const { languagesMap } = require('../../../formatters/patterns/user')

module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.lang = languagesMap[dados][0]

    await guild.save()

    // Redirecionando o evento
    const pagina_guia = 1
    require('../../chunks/panel_guild_logger')({ client, user, interaction, pagina_guia })
}