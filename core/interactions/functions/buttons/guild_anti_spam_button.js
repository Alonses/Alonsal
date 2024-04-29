const { ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js')

const { loggerMap } = require('../../../database/schemas/Guild')

const { listAllGuildStrikes, getGuildStrike } = require('../../../database/schemas/Strikes_guild')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_anti_spam", pagina_guia = 0
    const guild = await client.getGuild(interaction.guild.id)

    if (operacao > 3)
        pagina_guia = 2

    // Sem canal de avisos definido, solicitando um canal
    if (!guild.spam.channel && !guild.logger.channel) {
        reback = "panel_guild.0"
        operacao = 6
    }

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 1 -> Ativar ou desativar o módulo anti-spam

    // 3 -> Ativar ou desativar os links suspeitos
    // 4 -> Sub-menu para configurar os Strikes

    // 5 -> Quantidade de ativações para considerar spam
    // 6 -> Escolher canal de avisos
    // 7 -> Ativar ou desativar as notificações do anti-spam

    // 8 -> Ativar ou desativar a punição de moderadores no servidor

    if (operacao === 1) {

        if (!await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.ManageMessages]))
            return client.reply(interaction, {
                content: client.tls.phrase(user, "manu.painel.sem_permissoes", 7),
                ephemeral: true
            })

        if (!guild.spam.channel && !guild.logger.channel) // Sem canal definido para ativar o anti-spam
            return interaction.update({ content: ":mag: | Não é possível ativar esse módulo sem um canal de avisos definido.", ephemeral: true })

        // Ativa ou desativa o módulo anti-spam do servidor
        if (typeof guild.conf.spam !== "undefined")
            guild.conf.spam = !guild.conf.spam
        else
            guild.conf.spam = false

    } else if (operacao === 2) {

        if (!await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.KickMembers]))
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

        if (!await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.ManageMessages]))
            return client.reply(interaction, {
                content: client.tls.phrase(user, "manu.painel.sem_permissoes", 7),
                ephemeral: true
            })

        // Ativa ou desativa o sistema de links suspeitos do anti-spam
        if (typeof guild.spam.suspicious_links !== "undefined")
            guild.spam.suspicious_links = !guild.spam.suspicious_links
        else
            guild.spam.suspicious_links = false

        pagina_guia = 1

    } else if (operacao === 4) {

        const strikes = await listAllGuildStrikes(interaction.guild.id)

        // Submenu para navegar pelos strikes do servidor
        let botoes = [], row = [{
            id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_anti_spam.1"
        }], indice_matriz = 5

        if (strikes.length < 1) {
            await getGuildStrike(interaction.guild.id, 0)

            botoes.push({
                id: "strike_configure_button", name: "1°", type: 1, emoji: client.emoji(39), data: `9|0`
            })
        } else
            strikes.forEach(strike => {

                let disabled = false

                // Verificando se não há botões com regras que resultam em expulsão ou banimento listados antes
                if (strike.rank > indice_matriz)
                    disabled = true

                botoes.push({
                    id: "strike_configure_button", name: `${strike.rank + 1}°`, type: 1, emoji: strike.action ? loggerMap[strike.action] : client.emoji(39), data: `9|${strike.rank}`, disabled: disabled
                })

                if (strike.action)
                    if (strike.action === "member_kick_2" || strike.action === "member_ban")
                        indice_matriz = strike.rank
            })

        if (botoes.length < 5) // Botão para adicionar um novo strike
            row.push({ id: "strike_configure_button", name: client.tls.phrase(user, "menu.botoes.novo_strike"), type: 2, emoji: client.emoji(43), data: `9|${strikes.length < 1 ? 1 : strikes.length}` })

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "mode.spam.configurando_strikes"))
            .setColor(client.embed_color(user.misc.color))
            .setDescription(client.tls.phrase(user, "mode.spam.descricao_configuracao_strike"))
            .setFooter({
                text: client.tls.phrase(user, "mode.warn.customizacao_rodape"),
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        return interaction.update({
            embeds: [embed],
            components: [client.create_buttons(botoes, interaction), client.create_buttons(row, interaction)],
            ephemeral: true
        })

    } else if (operacao === 5) {

        // Definindo a quantia de ativações que os usuários precisam receber no servidor para serem considerados como spam
        const data = {
            title: { tls: "menu.menus.escolher_numero" },
            alvo: "guild_spam_strikes",
            number_values: true,
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
            title: { tls: "menu.menus.escolher_canal" },
            alvo: "guild_spam#channel",
            reback: "browse_button.guild_anti_spam_button",
            operation: operacao,
            values: []
        }

        if (guild.spam.channel)
            data.values.push({ name: client.tls.phrase(user, "manu.guild_data.remover_canal"), id: "none" })

        // Listando os canais do servidor
        data.values = data.values.concat(await client.getGuildChannels(interaction, ChannelType.GuildText, guild.spam.channel))

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `${reback}.2` },
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "4" }
        ]

        let row = client.menu_navigation(client, user, data, pagina || 0)

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
    } else if (operacao === 8) {

        // Ativa ou desativa a gerencia de moderadores no servidor
        if (typeof guild.spam.manage_mods !== "undefined")
            guild.spam.manage_mods = !guild.spam.manage_mods
        else
            guild.spam.manage_mods = false

        pagina_guia = 1
    }

    if (operacao === 10)
        pagina_guia = 1

    await guild.save()

    // Redirecionando a função para o painel de anti-spam
    require('../../chunks/panel_guild_anti_spam')({ client, user, interaction, pagina_guia })
}