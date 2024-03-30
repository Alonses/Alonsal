module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)

    // Invertendo os eventos
    Object.keys(interaction.values).forEach(indice => {
        const evento = interaction.values[indice].split("|")[1]
        guild.death_note[evento] = !guild.death_note[evento]
    })

    await guild.save()

    // Redirecionando o evento
    const pagina_guia = 2
    require('../../chunks/panel_guild_logger')({ client, user, interaction, pagina_guia })
}