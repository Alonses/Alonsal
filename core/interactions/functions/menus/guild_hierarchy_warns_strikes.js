module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.warn.hierarchy.strikes = parseInt(dados)

    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_hierarchy_warns')({ client, user, interaction })
}