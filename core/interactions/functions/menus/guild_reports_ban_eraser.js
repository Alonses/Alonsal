module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.reports.erase_ban_messages = parseInt(dados)

    await guild.save()

    const pagina_guia = 1 // Redirecionando o evento
    require('../../chunks/panel_guild_external_reports')({ client, user, interaction, pagina_guia })
}