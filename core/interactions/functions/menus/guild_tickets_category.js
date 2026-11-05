module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.tickets.category = dados

    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_tickets')({ client, user, interaction })
}