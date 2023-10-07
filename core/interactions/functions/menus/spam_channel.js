module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)
    guild.logger.channel = dados

    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_anti_spam')({ client, user, interaction })
}