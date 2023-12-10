module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    const acao = dados.split(".")[0]
    const submenu = parseInt(dados.split(".")[1])

    if (submenu === 20) // Penalidades por advertência
        guild.warn.warned = acao
    else // Penalidade da advertência final
        guild.warn.action = acao

    await guild.save()

    // Redirecionando o evento
    const pagina_guia = 1
    require('../../chunks/panel_guild_warns')({ client, user, interaction, pagina_guia })
}