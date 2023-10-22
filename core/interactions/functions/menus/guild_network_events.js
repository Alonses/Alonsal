module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)

    // Invertendo os eventos
    Object.keys(interaction.values).forEach(indice => {
        const evento = interaction.values[indice].split("|")[1]
        guild.network[evento] = !guild.network[evento]
    })

    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_network')({ client, user, interaction })
}