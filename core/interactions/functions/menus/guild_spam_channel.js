module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.spam.channel = dados === "none" ? null : dados

    await guild.save()

    // Redirecionando o evento
    const pagina_guia = 2
    require('../../chunks/panel_guild_anti_spam')({ client, user, interaction, pagina_guia })
}