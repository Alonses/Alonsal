module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    const novo_limite = parseInt(dados.split(".")[0])

    // Atualizando as preferências de limite de membros para os canais dinâmicos do servidor
    guild.voice_channels.preferences.user_limit = novo_limite
    await guild.save()

    const pagina_guia = 1
    require("../../chunks/panel_guild_voice_channels")({ client, user, interaction, pagina_guia })
}