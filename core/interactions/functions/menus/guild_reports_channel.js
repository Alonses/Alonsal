module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.reports.channel = dados

    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_external_reports')({ client, user, interaction })
}