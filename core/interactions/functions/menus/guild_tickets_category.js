module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.tickets.category = client.encrypt(dados)

    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_tickets')({ client, user, interaction })
}