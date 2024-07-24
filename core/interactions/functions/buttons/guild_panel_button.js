module.exports = async ({ client, user, interaction }) => {

    // Tratamento dos cliques
    // 2 -> Anúncio de Games ( Movido para guild_free_games_button )

    // 3 -> Denúncias in-server ( Movido para guild_tickets_button )
    // 4 -> Reportes de usuários mau comportados ( Movido para guild_reports_button )
    // 5 -> Logger do servidor ( Movido para guild_logger_button )

    // 6 -> Módulo anti-spam ( Movido para guild_anti_spam_button )
    // 8 -> AutoBan ( Movido para guild_reports_button )

    // 9 -> Convites Rastreados ( Movido para guild_tracked_invites_button )

    const pagina_guia = 2
    require('../../chunks/panel_guild')({ client, user, interaction, pagina_guia })
}