module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.games.channel = dados

    await guild.save()

    if (!guild.game.role) { // Redirecionando para escolher o cargo
        dados = `${interaction.user.id}.3`
        return require('../buttons/guild_free_games_button')({ client, user, interaction, dados })
    }

    // Redirecionando o evento
    require('../../chunks/panel_guild_free_games')({ client, user, interaction })
}