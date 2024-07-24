module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.nuke_invites.channel = dados

    await guild.save()

    require('../../chunks/panel_guild_tracked_invites')({ client, user, interaction })
}