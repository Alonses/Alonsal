module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.warn.erase_ban_messages = parseInt(dados)

    await guild.save()

    const pagina_guia = 2 // Redirecionando o evento
    require('../../chunks/panel_guild_warns')({ client, user, interaction, pagina_guia })
}