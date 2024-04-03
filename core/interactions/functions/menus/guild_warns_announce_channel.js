module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.warn.announce.channel = dados

    if (dados === "none") // Removendo canal selecionado
        guild.warn.announce.channel = null

    await guild.save()

    // Redirecionando o evento
    const pagina_guia = 1
    require('../../chunks/panel_guild_warns')({ client, user, interaction, pagina_guia })
}