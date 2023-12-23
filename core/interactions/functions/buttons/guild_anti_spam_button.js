const { ChannelType, PermissionsBitField } = require('discord.js')

const { spamTimeoutMap } = require('../../../database/schemas/Strikes')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_anti_spam", pagina_guia = 0
    const guild = await client.getGuild(interaction.guild.id)

    // Sem canal de avisos definido, solicitando um canal
    if (!guild.logger.channel) {
        reback = "panel_guild.0"
        operacao = 6
    }

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 1 -> Ativar ou desativar o módulo anti-spam
    // 2 -> Punições por níveis
    // 3 -> Links suspeitos
    // 4 -> Tempo de mute padrão
    // 5 -> Quantidade de ativações para considerar spam
    // 6 -> Escolher canal de avisos
    // 7 -> Ativar ou desativar as notificações do anti-spam

    if (operacao === 1) {

        const permissoes = await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.ManageMessages])

        if (!permissoes)
            return client.reply(interaction, {
                content: client.tls.phrase(user, "manu.painel.sem_permissoes", 7),
                ephemeral: true
            })

        // Ativa ou desativa o módulo anti-spam do servidor
        if (typeof guild.conf.spam !== "undefined")
            guild.conf.spam = !guild.conf.spam
        else
            guild.conf.spam = false

    } else if (operacao === 2) {

        const permissoes = await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.KickMembers])

        if (!permissoes)
            return client.reply(interaction, {
                content: client.tls.phrase(user, "manu.painel.sem_permissoes", 7),
                ephemeral: true
            })

        // Ativa ou desativa o sistema de strikes do anti-spam
        if (typeof guild.spam.strikes !== "undefined")
            guild.spam.strikes = !guild.spam.strikes
        else
            guild.spam.strikes = false

    } else if (operacao === 3) {

        const permissoes = await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.ManageMessages])

        if (!permissoes)
            return client.reply(interaction, {
                content: client.tls.phrase(user, "manu.painel.sem_permissoes", 7),
                ephemeral: true
            })

        // Ativa ou desativa o sistema de links suspeitos do anti-spam
        if (typeof guild.spam.suspicious_links !== "undefined")
            guild.spam.suspicious_links = !guild.spam.suspicious_links
        else
            guild.spam.suspicious_links = false

    } else if (operacao === 4) {

        const valores = []

        Object.keys(spamTimeoutMap).forEach(key => {
            valores.push(spamTimeoutMap[key])
        })

        // Definindo o tempo mínimo que um usuário deverá ficar mutado no servidor
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "guild_spam_timeout",
            values: valores
        }

        let row = client.create_buttons([{
            id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_anti_spam.1"
        }], interaction)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data }), row],
            ephemeral: true
        })

    } else if (operacao === 5) {

        // Definindo a quantia de ativações que os usuários precisam receber no servidor para serem considerados como spam
        const data = {
            title: client.tls.phrase(user, "menu.menus.escolher_numero", 1),
            alvo: "guild_spam_strikes",
            values: ["3", "4", "5", "6", "7", "8", "9", "10"]
        }

        let row = client.create_buttons([{
            id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_anti_spam.1"
        }], interaction)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data }), row],
            ephemeral: true
        })
    } else if (operacao === 6) {

        // Definindo o canal de avisos do anti-spam
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "guild_spam#channel",
            reback: "browse_button.guild_anti_spam_button",
            operation: operacao,
            values: await client.getGuildChannels(interaction, ChannelType.GuildText, guild.logger.channel)
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `${reback}.1` },
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "4" }
        ]

        let row = client.menu_navigation(data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })
    } else if (operacao === 7) {

        // Ativa ou desativa as notificações do anti-spam do servidor
        if (typeof guild.spam.notify !== "undefined")
            guild.spam.notify = !guild.spam.notify
        else
            guild.spam.notify = false
    }

    if (operacao > 3)
        pagina_guia = 1

    await guild.save()

    // Redirecionando a função para o painel de anti-spam
    require('../../chunks/panel_guild_anti_spam')({ client, user, interaction, pagina_guia })
}