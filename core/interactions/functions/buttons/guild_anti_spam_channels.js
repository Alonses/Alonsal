module.exports = async ({ client, user, interaction, dados, pagina_guia }) => {

    // Redirecionando a interação
    require('../../chunks/guild_anti_spam_channels')({ client, user, interaction, dados, pagina_guia })
}