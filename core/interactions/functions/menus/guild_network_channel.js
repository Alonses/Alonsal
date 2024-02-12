module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.network.channel = dados

    if (dados === "none")
        guild.network.channel = null

    await guild.save()

    // Redirecionando o evento
    const pagina_guia = 1
    require('../../chunks/panel_guild_network')({ client, user, interaction, pagina_guia })
}