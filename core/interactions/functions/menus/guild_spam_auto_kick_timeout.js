module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    const acao = parseInt(dados.split(".")[0])

    guild.spam.auto_kick.timeout = acao
    await guild.save()

    // Redirecionando o evento
    const pagina_guia = 1
    require('../../chunks/panel_guild_anti_spam')({ client, user, interaction, pagina_guia })
}