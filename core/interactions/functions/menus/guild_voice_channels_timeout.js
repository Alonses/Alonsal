module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.voice_channels.timeout = dados
    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_voice_channels')({ client, user, interaction })
}