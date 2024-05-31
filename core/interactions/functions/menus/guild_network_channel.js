module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.network.channel = dados === "none" ? null : dados

    await guild.save()

    const pagina_guia = 1 // Redirecionando o evento
    require('../../chunks/panel_guild_network')({ client, user, interaction, pagina_guia })
}