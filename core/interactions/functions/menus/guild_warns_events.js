module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.warn.action = dados

    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_warns')({ client, user, interaction })
}