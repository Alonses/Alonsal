module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    const acao = parseInt(dados.split(".")[0])

    guild.warn.reset = acao
    await guild.save()

    // Redirecionando o evento
    const pagina_guia = 1
    require('../../chunks/panel_guild_warns')({ client, user, interaction, pagina_guia })
}