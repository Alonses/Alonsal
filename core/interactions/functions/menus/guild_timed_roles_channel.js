module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.timed_roles.channel = dados

    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_timed_roles')({ client, user, interaction })
}