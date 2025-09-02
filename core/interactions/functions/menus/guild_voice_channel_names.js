module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    const categoria_nomes = dados.split(".")[1]

    // Atualizando as preferências de nomes dos canais dinâmicos do servidor
    guild.voice_channels.preferences.voice_names = categoria_nomes
    await guild.save()

    const pagina_guia = 1
    require("../../chunks/panel_guild_voice_channels")({ client, user, interaction, pagina_guia })
}