module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.games.channel = dados

    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_free_games')({ client, user, interaction })
}