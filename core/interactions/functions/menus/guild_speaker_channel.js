module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    const canais = guild.speaker?.channels.split(";") || []

    // Listando os canais selecionados
    Object.keys(interaction.values).forEach(indice => {
        const canal = interaction.values[indice].split("|")[1]

        if (!guild.speaker.channels.includes(canal))
            canais.push(canal)
        else // Removendo um canal que já se encontra ativo
            canais.splice(canais.indexOf(canal), 1)
    })

    // Salvando os canais selecionados
    guild.speaker.channels = canais.length > 1 ? canais.join(";") : canais.length === 1 ? canais[0] : null

    if (!guild.speaker.channels) // Desligando a trava de canais especificos
        guild.speaker.regional_limit = false

    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_speaker')({ client, user, interaction })
}