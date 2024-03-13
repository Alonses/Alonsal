module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.spam.channel = dados

    if (dados === "none")
        guild.spam.channel = null

    await guild.save()

    // Redirecionando o evento
    const pagina_guia = 1
    require('../../chunks/panel_guild_anti_spam')({ client, user, interaction, pagina_guia })
}