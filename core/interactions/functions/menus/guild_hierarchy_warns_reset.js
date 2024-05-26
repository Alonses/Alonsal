module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    const acao = parseInt(dados.split(".")[0])

    guild.warn.hierarchy.reset = acao
    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_hierarchy_warns')({ client, user, interaction })
}