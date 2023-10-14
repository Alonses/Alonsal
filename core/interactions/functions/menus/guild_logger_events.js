module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)

    // Invertendo os eventos
    Object.keys(interaction.values).forEach(indice => {
        const evento = interaction.values[indice].split("|")[1]
        guild.logger[evento] = !guild.logger[evento]
    })

    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_logger')({ client, user, interaction })
}