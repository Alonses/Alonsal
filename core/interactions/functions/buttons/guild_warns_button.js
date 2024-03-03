const { ChannelType, EmbedBuilder } = require('discord.js')

const { loggerMap } = require('../../../database/schemas/Guild')
const { spamTimeoutMap } = require('../../../database/schemas/Strikes')

const { atualiza_warns } = require('../../../auto/warn')
const { listAllGuildWarns, getGuildWarn } = require('../../../database/schemas/Warns_guild')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_warns.1", pagina_guia = 0

    const advertencias = await listAllGuildWarns(interaction.guild.id)
    const guild = await client.getGuild(interaction.guild.id)

    // Sem canal de avisos definido, solicitando um canal
    if (!guild.warn.channel || advertencias.length < 1) {
        reback = "panel_guild.0"
        operacao = 5
    }

    if (advertencias.length < 1) {
        operacao = 3

        // Desligando as advertências caso não haja suficientes criadas
        if (advertencias.length < 2) {
            guild.conf.warn = false
            await guild.save()
        }
    }

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 1 -> Ativar ou desativar o warn
    // 3 -> Configurar advertências

    // 5 -> Escolher canal de avisos
    // 6 -> Advertências cronometradas
    // 8 -> Ativar ou desativar as notificações das advertências

    // 9 -> Alterar de página dentro do guia
    // 10 -> Ativar ou desativar as notificações de exclusões de advertências

    // 15 -> Sub menu com as opções para gerenciar as notificações

    // 16 -> Tempo de expiração das advertências
    // 20 e 21 -> Sub menu com opções para gerenciar penalidades no servidor

    if (operacao === 1) {

        if (advertencias.length < 2)
            return interaction.update({
                content: client.tls.phrase(user, "mode.warn.bloqueio_minimo", 47),
                ephemeral: true
            })

        // Ativa ou desativa as advertências do servidor
        if (typeof guild.conf.warn !== "undefined")
            guild.conf.warn = !guild.conf.warn
        else
            guild.conf.warn = true

    } else if (operacao === 3) {

        // Submenu para navegar pelas advertências do servidor
        let botoes = [], row = [{
            id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_warns.1"
        }], indice_matriz = 5

        if (advertencias.length < 1) {
            await getGuildWarn(interaction.guild.id, 0)

            botoes.push({
                id: "warn_configure_button", name: "1°", type: 1, emoji: client.emoji(39), data: `9|0`
            })
        } else
            advertencias.forEach(warn => {

                let disabled = false

                // Verificando se não há botões com regras que resultam em expulsão ou banimento listados antes
                if (warn.rank > indice_matriz)
                    disabled = true

                botoes.push({
                    id: "warn_configure_button", name: `${warn.rank + 1}°`, type: 1, emoji: warn.action ? loggerMap[warn.action] : client.emoji(39), data: `9|${warn.rank}`, disabled: disabled
                })

                if (warn.action)
                    if (warn.action === "member_kick_2" || warn.action === "member_ban")
                        indice_matriz = warn.rank
            })

        if (botoes.length < 5) // Botão para adicionar uma nova advertência
            row.push({ id: "warn_configure_button", name: client.tls.phrase(user, "menu.botoes.nova_advertencia"), type: 2, emoji: client.emoji(43), data: `9|${advertencias.length < 1 ? 1 : advertencias.length}` })

        return interaction.update({
            components: [client.create_buttons(botoes, interaction), client.create_buttons(row, interaction)],
            ephemeral: true
        })

    } else if (operacao === 5) {

        // Definindo o canal de avisos dos warns
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "guild_warns#channel",
            reback: "browse_button.guild_warns_button",
            operation: operacao,
            values: await client.getGuildChannels(interaction, ChannelType.GuildText, guild.warn.channel)
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback },
            { id: "guild_warns_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "5" }
        ]

        let row = client.menu_navigation(data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })

    } else if (operacao === 6) {

        // Ativa ou desativa as advertências cronometradas no servidor
        if (typeof guild.warn.timed !== "undefined")
            guild.warn.timed = !guild.warn.timed
        else
            guild.warn.timed = true

        // Sincronizando a lista de advertências do cache
        atualiza_warns()

    } else if (operacao === 8) {

        // Ativa ou desativa as notificações de advertências
        if (typeof guild.warn.notify !== "undefined")
            guild.warn.notify = !guild.warn.notify
        else
            guild.warn.notify = false

        operacao = 15

        await guild.save()

    } else if (operacao === 10) {

        // Ativa ou desativa as notificações de advertências
        if (typeof guild.warn.notify_exclusion !== "undefined")
            guild.warn.notify_exclusion = !guild.warn.notify_exclusion
        else
            guild.warn.notify_exclusion = false

        operacao = 15

        await guild.save()
    }

    // Sub menu com as opções de notificações
    if (operacao == 15) {

        const guild = await client.getGuild(interaction.guild.id)

        const embed = new EmbedBuilder()
            .setTitle(`> ${client.tls.phrase(user, "mode.warn.advertencias")} :octagonal_sign:`)
            .setColor(client.embed_color(user.misc.color))
            .setDescription(client.tls.phrase(user, "mode.warn.descricao_notificacao_advertencia"))
            .setFields(
                {
                    name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                    value: `${client.emoji(20)} ${client.execute("functions", "emoji_button.emoji_button", guild?.warn.notify)} **${client.tls.phrase(user, "mode.spam.mencoes")}**\n${client.emoji("icon_id")} \`${guild.warn.channel ? guild.warn.channel : client.tls.phrase(user, "mode.network.sem_canal")}\`${guild.warn.channel ? `\n( <#${guild.warn.channel}> )` : ""}`,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `${client.emoji(20)} ${client.execute("functions", "emoji_button.emoji_button", guild?.warn.notify_exclusion)} **${client.tls.phrase(user, "menu.botoes.notificar_remocao")}**`,
                    inline: true
                },
                { name: "⠀", value: "⠀", inline: true }
            )
            .setFooter({
                text: client.tls.phrase(user, "mode.warn.editar_advertencia"),
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        let row = client.create_buttons([
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_warns.0" },
            { id: "guild_warns_button", name: client.tls.phrase(user, "mode.spam.mencoes"), type: client.execute("functions", "emoji_button.type_button", guild?.warn.notify), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.warn.notify), data: "8" },
            { id: "guild_warns_button", name: client.tls.phrase(user, "menu.botoes.notificar_remocao"), type: client.execute("functions", "emoji_button.type_button", guild?.warn.notify_exclusion), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.warn.notify_exclusion), data: "10" }
        ], interaction)

        return interaction.update({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })

    } else if (operacao == 16) {

        const valores = []

        Object.keys(spamTimeoutMap).forEach(key => {
            valores.push(spamTimeoutMap[key])
        })

        // Definindo o tempo mínimo que um usuário deverá ficar mutado no servidor
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "guild_warns_reset",
            submenu: operacao,
            values: valores
        }

        let row = client.create_buttons([{
            id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback
        }], interaction)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data }), row],
            ephemeral: true
        })
    }

    if (operacao > 8)
        pagina_guia = 1

    await guild.save()

    // Redirecionando a função para o painel das advertências
    require('../../chunks/panel_guild_warns')({ client, user, interaction, pagina_guia })
}