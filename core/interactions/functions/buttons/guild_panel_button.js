const { PermissionsBitField } = require('discord.js')

const { verificar_broadcast } = require('../../../events/broadcast')

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])
    const guild = await client.getGuild(interaction.guild.id)
    let pagina_guia = 2

    // Tratamento dos cliques
    // 0 -> Alonsal Falador ( Movido para guild_speaker_button )
    // 1 -> Permitir Broadcast
    // 2 -> Anúncio de Games ( Movido para guild_free_games_button )

    // 3 -> Denúncias in-server ( Movido para guild_tickets_button )
    // 4 -> Reportes de usuários mau comportados ( Movido para guild_reports_button )
    // 5 -> Logger do servidor ( Movido para guild_logger_button )

    // 6 -> Módulo anti-spam ( Movido para guild_anti_spam_button )
    // 8 -> AutoBan ( Movido para guild_reports_button )

    // 9 -> Convites Rastreados

    if (escolha === 0) {
        // Ativa ou desativa a capacidade do Alonsal falar no servidor livremente ( através do clever )
        if (typeof guild.conf.conversation !== "undefined")
            guild.conf.conversation = !guild.conf.conversation
        else
            guild.conf.conversation = false

    } else if (escolha === 1) {

        // Ativa ou desativa a possibilidade do Alonsal realizar Broadcasting nos chats do servidor
        if (typeof guild.conf.broadcast !== "undefined")
            guild.conf.broadcast = !guild.conf.broadcast
        else
            guild.conf.broadcast = true

        // Broadcast desligado
        if (!guild.conf.broadcast)
            verificar_broadcast(client, interaction)

        pagina_guia = 3

    } else if (escolha === 9) {

        if (!await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ManageGuild]))
            return interaction.update({ content: client.tls.phrase(user, "mode.invites.sem_permissao", 7), ephemeral: true })

        // Ativa ou desativa os convites rastreados
        if (typeof guild.conf.nuke_invites !== "undefined")
            guild.conf.nuke_invites = !guild.conf.nuke_invites
        else
            guild.conf.nuke_invites = true
    }

    await guild.save()

    require('../../chunks/panel_guild')({ client, user, interaction, pagina_guia })
}