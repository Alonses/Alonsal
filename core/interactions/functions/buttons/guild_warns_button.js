const { ChannelType } = require('discord.js')

const { atualiza_warns } = require('../../../auto/triggers/user_warns')
const { listAllGuildWarns, getGuildWarn } = require('../../../database/schemas/Guild_warns')

const { loggerMap } = require('../../../formatters/patterns/guild')
const { banMessageEraser, spamTimeoutMap } = require('../../../formatters/patterns/timeout')

// 6 -> Advertências cronometradas
// 8 -> Ativar ou desativar as notificações das advertências
// 10 -> Ativar ou desativar as notificações de exclusões de advertências
// 11 -> Ativar ou desativar anúncios públicos

const operations = {
    6: { action: "warn.timed", page: 0 },
    8: { action: "warn.notify", page: 1 },
    10: { action: "warn.notify_exclusion", page: 1 },
    11: { action: "warn.announce.status", page: 1 }
}

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_warns.2", pagina_guia = 0

    const advertencias = await listAllGuildWarns(interaction.guild.id)
    let guild = await client.getGuild(interaction.guild.id)

    if (operacao > 8) pagina_guia = 2

    // Sem canal de avisos definido, solicitando um canal
    if (!guild.warn.channel) {
        reback = "panel_guild.0"
        operacao = 5
    }

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 1 -> Ativar ou desativar o warn
    // 3 -> Configurar advertências

    // 5 -> Escolher canal de avisos
    // 7 -> Definir exclusão de mensagens por banimento

    // 9 -> Alterar de página dentro do guia
    // 12 -> Definir canal de anúncios públicos
    // 15 -> Sub menu com as opções para gerenciar as notificações

    // 17 -> Definir canal temporário de avisos das advertências

    // 16 -> Tempo de expiração das advertências
    // 20 e 21 -> Sub menu com opções para gerenciar penalidades no servidor

    if (operations[operacao]) {

        let dado = guild;
        ({ dado, pagina_guia } = client.execute("switcher", { dado, operations, operacao }))
        await dado.save()

    } else if (operacao === 1) {

        if (advertencias.length < 2)
            return interaction.update({
                content: client.tls.phrase(user, "mode.warn.bloqueio_minimo", 47),
                flags: "Ephemeral"
            })

        // Ativa ou desativa as advertências do servidor
        guild.conf.warn = !guild.conf.warn

        await guild.save()

    } else if (operacao === 3) {

        // Submenu para navegar pelas advertências do servidor
        let botoes = [], row = [
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: "panel_guild_warns.0" }
        ], indice_matriz = 5

        if (advertencias.length < 1) {
            await getGuildWarn(interaction.guild.id, 0)

            botoes.push({
                id: "warn_configure_button", name: "1°", type: 0, emoji: client.emoji(39), data: `9|0`
            })
        } else
            advertencias.forEach(warn => {

                let disabled = false

                // Verificando se não há botões com regras que resultam em expulsão ou banimento listados antes
                if (warn.rank > indice_matriz)
                    disabled = true

                botoes.push({
                    id: "warn_configure_button", name: `${warn.rank + 1}°`, type: 0, emoji: warn.action ? loggerMap[warn.action] : client.emoji(39), data: `9|${warn.rank}`, disabled: disabled
                })

                if (warn.action)
                    if (warn.action === "member_kick_2" || warn.action === "member_ban")
                        indice_matriz = warn.rank
            })

        if (botoes.length < 5) // Botão para adicionar uma nova advertência
            row.push({ id: "warn_configure_button", name: { tls: "menu.botoes.nova_advertencia" }, type: 1, emoji: client.emoji(43), data: `9|${advertencias.length < 1 ? 1 : advertencias.length}` })

        const embed = client.create_embed({
            title: { tls: "mode.warn.configurando_warns" },
            description: { tls: "mode.warn.descricao_configuracao_warn" },
            footer: {
                text: { tls: "mode.warn.customizacao_rodape" },
                iconURL: interaction.user.avatarURL({ dynamic: true })
            }
        }, user)

        return interaction.update({
            embeds: [embed],
            components: [client.create_buttons(botoes, interaction, user), client.create_buttons(row, interaction, user)],
            flags: "Ephemeral"
        })

    } else if (operacao === 5 || operacao === 12 || operacao === 17) {

        // Definindo o canal de avisos dos warns, canal de avisos públicos ou de avisos temporários
        let canal = guild.warn.channel, alvo = "guild_warns#channel", digito = 2

        if (operacao === 12) {
            canal = guild.warn.announce.channel
            alvo = "guild_warns_announce#channel"
            reback = "panel_guild_warns"
            digito = 1
        }

        if (operacao === 17) {
            canal = guild.warn.timed_channel
            alvo = "guild_warns_timed_channel#channel"
            reback = "panel_guild_warns"
            digito = 2
        }

        const data = {
            title: { tls: "menu.menus.escolher_canal" },
            pattern: "choose_channel",
            alvo: alvo,
            reback: "browse_button.guild_warns_button",
            operation: operacao,
            values: []
        }

        if (canal && (operacao === 12 || operacao === 17))
            data.values.push({ name: client.tls.phrase(user, "manu.guild_data.remover_canal"), id: "none" })

        // Listando os canais do servidor
        data.values = data.values.concat(await client.execute("getGuildChannels", {
            interaction,
            user,
            tipo: ChannelType.GuildText,
            id_configurado: canal
        }))

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24) pagina--

        const row = client.execute("menu_navigation", { user, data, pagina })
        let botoes = [
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: `${reback}.${digito}` },
            { id: "guild_warns_button", name: { tls: "menu.botoes.atualizar" }, type: 0, emoji: client.emoji(42), data: operacao }
        ]

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data, pagina }), client.create_buttons(botoes, interaction, user)],
            flags: "Ephemeral"
        })

    } else if (operacao === 7) {

        // Escolhendo o tempo de exclusão das mensagens para membros banidos por advertências
        const valores = []
        Object.keys(banMessageEraser).forEach(key => { if (parseInt(key) !== guild.warn.erase_ban_messages) valores.push(key) })

        const data = {
            title: { tls: "menu.menus.escolher_expiracao" },
            pattern: "numbers",
            alvo: "guild_warns_ban_eraser",
            values: valores
        }

        let row = client.create_buttons([
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: `${reback}.2` }
        ], interaction, user)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data }), row],
            flags: "Ephemeral"
        })

    } else if (operacao == 16) {

        // Definindo o tempo de expiração das advertências no servidor
        const valores = []
        Object.keys(spamTimeoutMap).forEach(key => { if (parseInt(key) !== guild.warn.reset) valores.push(`${key}.${spamTimeoutMap[key]}`) })

        const data = {
            title: { tls: "mode.warn.definir_tempo" },
            pattern: "numbers",
            alvo: "guild_warns_reset",
            submenu: operacao,
            values: valores
        }

        let row = client.create_buttons([{
            id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: reback
        }], interaction, user)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data }), row],
            flags: "Ephemeral"
        })
    }

    // Sincroniza as advertências criadas
    if (operacao === 6) atualiza_warns()

    // Alterando a página
    if (operacao === 15) pagina_guia = 1

    // Redirecionando a função para o painel das advertências
    require('../../chunks/panel_guild_warns')({ client, user, interaction, pagina_guia })
}