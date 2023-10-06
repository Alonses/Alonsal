const { PermissionsBitField } = require('discord.js')

const { verificar_broadcast } = require('../../../events/broadcast')

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])
    const guild = await client.getGuild(interaction.guild.id)
    let pagina = 0

    // Tratamento dos cliques
    // 1 -> Alonsal Falador
    // 2 -> Permitir Broadcast
    // 3 -> Anúncio de Games

    // 4 -> Denúncias in-server
    // 5 -> Reportes de usuários mau comportados
    // 6 -> Logger do servidor

    // 7 -> Módulo anti-spam ( Movido para anti_spam_button )
    // 8 -> Servidor visível globalmente
    // 9 -> AutoBan 

    if (escolha === 1) {
        // Ativa ou desativa a capacidade do Alonsal falar no servidor livremente ( através do clever )
        if (typeof guild.conf.conversation !== "undefined")
            guild.conf.conversation = !guild.conf.conversation
        else
            guild.conf.conversation = false

    } else if (escolha === 2) {

        // Ativa ou desativa a possibilidade do Alonsal realizar Broadcasting nos chats do servidor
        if (typeof guild.conf.broadcast !== "undefined")
            guild.conf.broadcast = !guild.conf.broadcast
        else
            guild.conf.broadcast = true

        // Broadcast desligado
        if (!guild.conf.broadcast)
            verificar_broadcast(client, interaction)

    } else if (escolha === 3) {

        if (!guild.games.channel || !guild.games.role)
            return interaction.update({
                content: client.tls.phrase(user, "game.anuncio.falta_vinculo", 0),
                ephemeral: true
            })
        else {
            // Ativa ou desativa o anúncio de games gratuitos no servidor
            if (typeof guild.conf.games !== "undefined")
                guild.conf.games = !guild.conf.games
            else
                guild.conf.games = false
        }
    } else if (escolha === 4) {

        if (!guild.reports.channel)
            return interaction.update({
                content: client.tls.phrase(user, "mode.denuncia.falta_vinculo", 0),
                ephemeral: true
            })
        else {
            // Ativa ou desativa a função de denúncias in-server pelo bot
            if (typeof guild.conf.tickets !== "undefined")
                guild.conf.tickets = !guild.conf.tickets
            else
                guild.conf.tickets = false
        }
    } else if (escolha === 5) {

        if (!guild.tickets.category)
            return interaction.update({
                content: client.tls.phrase(user, "mode.report.falta_vinculo", 0),
                ephemeral: true
            })
        else {
            // Ativa ou desativa o relatório de outros usuários mau comportados no servidor
            if (typeof guild.conf.reports !== "undefined")
                guild.conf.reports = !guild.conf.reports
            else
                guild.conf.reports = false
        }
    } else if (escolha === 6) {

        if (!guild.logger.channel)
            return interaction.update({
                content: client.tls.phrase(user, "mode.logger.falta_vinculo", 0),
                ephemeral: true
            })
        else {
            // Ativa ou desativa o relatório de eventos do servidor
            if (typeof guild.conf.logger !== "undefined") {

                // Verificando se o bot possui permissões para ver o registro de auditoria
                if (!guild.conf.logger) {
                    const aprovacao = client.verifyLogger(interaction)

                    if (!aprovacao)
                        return client.notify(guild.logger.channel, { content: `@here ${client.tls.phrase(guild, "mode.logger.permissao", 7)}` })
                }

                guild.conf.logger = !guild.conf.logger
            } else
                guild.conf.logger = false
        }
    } else if (escolha === 8) {

        // Ativa ou desativa a exibição pública no ranking global
        if (typeof guild.conf.public !== "undefined")
            guild.conf.public = !guild.conf.public
        else
            guild.conf.public = false
    } else if (escolha === 9) {

        const membro_sv = await client.getMemberGuild(interaction, client.id())

        // Permissões para banir outros membros
        if (!membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))
            return client.tls.report(interaction, user, "mode.report.auto_ban_painel", true, 7, null, true)

        // Ativa ou desativa a opção de autoBan do comando /reporte
        if (typeof guild.conf.auto_ban !== "undefined")
            guild.conf.auto_ban = !guild.conf.auto_ban
        else
            guild.conf.auto_ban = true
    }

    if (escolha > 3)
        pagina = 1

    if (escolha > 6)
        pagina = 2

    await guild.save()

    require('../../../formatters/chunks/model_guild_panel')(client, user, interaction, pagina)
}