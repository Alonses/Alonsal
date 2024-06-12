module.exports = async ({ client, user, interaction }) => {

    if (interaction.options.getString("reason")) // Salva o motivo da remoção da advertência no cache do bot
        client.cached.warns.set(interaction.user.id, { relatory: interaction.options.getString("reason"), keep: false })

    // Redirecionando o evento
    require('../../../core/interactions/chunks/panel_guild_browse_warns')({ client, user, interaction })
}