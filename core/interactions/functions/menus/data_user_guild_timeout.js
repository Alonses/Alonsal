module.exports = async ({ client, user, interaction, dados }) => {

    user.erase.guild_timeout = dados
    await user.save()

    // Redirecionando o evento
    const pagina_guia = 1
    require('../../chunks/panel_personal_data')({ client, user, interaction, pagina_guia })
}