module.exports = async ({ client, user, dados, interaction }) => {

    const operacao = parseInt(dados.split(".")[1])
    let pagina_guia = 2

    // Tratamento dos cliques
    // 2 -> Anúncio de Games ( Movido para guild_free_games_button )

    // 3 -> Denúncias in-server ( Movido para guild_tickets_button )
    // 4 -> Reportes de usuários mau comportados ( Movido para guild_reports_button )
    // 5 -> Logger do servidor ( Movido para guild_logger_button )

    // 6 -> Módulo anti-spam ( Movido para guild_anti_spam_button )
    // 8 -> AutoBan ( Movido para guild_reports_button )

    // 9 -> Convites Rastreados ( Movido para guild_tracked_invites_button )

    if (operacao === 13) {

        const guild = await client.getGuild(interaction.guild.id)

        // Invertendo o status do servidor rankeado
        guild.conf.ranking = !guild.conf.ranking
        await guild.save()

        // Sincronizando os servidores rankeados salvos em cache
        if (guild.conf.ranking)
            client.cached.ranked_guilds.set(guild.sid, true)
        else
            client.cached.ranked_guilds.delete(guild.sid)

        pagina_guia = 3
    }

    require('../../chunks/panel_guild')({ client, user, interaction, pagina_guia })
}