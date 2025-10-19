const { ChannelType } = require('discord.js')

const { getGuildVoiceTrigger, listAllGuildVoiceTriggers, dropGuildVoiceTrigger } = require('../../../database/schemas/Voice_triggers')

const { voice_names } = require('../../../formatters/patterns/guild')

// 1 -> Define o status de funcionamento do trigger
// 22 -> Define se os canais serão sempre privados
// 24 -> Define se os canais terão texto liberado para envio

const operations = {
    1: { action: "config.active", page: 0 },
    22: { action: "config.preferences.always_private", page: 0 },
    24: { action: "config.preferences.allow_text", page: 0 }
}

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    const hash_trigger = dados.split(".")[2]
    let operacao = parseInt(dados.split(".")[1]), reback = `voice_trigger_configure_button.${hash_trigger}`

    const trigger = await getGuildVoiceTrigger(client, client.encrypt(interaction.guild.id), hash_trigger) // Cria um novo strike caso o ID passado não exista

    // Trigger sem categoria definida
    if (!trigger.config.category && operacao !== 26) operacao = 3

    // Trigger sem canal definido
    if (!trigger.config.channel && operacao !== 26) operacao = 2

    // Tratamento dos cliques
    // 2 -> Altera o canal gatilho
    // 3 -> Altera a categoria dos canais de voz dinâmicos

    // 21 -> Define o tamanho dos canais de voz
    // 23 -> Define o tema dos nomes dos canais

    // 25 -> Sub menu para confirmar exclusão do trigger
    // 26 -> Confirmação para excluir o trigger

    if (operations[operacao]) {

        // Verificando limite de ativadores habilitados no servidor
        if (operacao === 1 && !trigger.config.active) {

            const active_triggers = (await listAllGuildVoiceTriggers(client.encrypt(interaction.guild.id), true)).length
            const guild = await client.getGuild(interaction.guild.id)

            if (active_triggers > (guild.misc.subscription.active ? 10 : 2))
                return client.reply(interaction, {
                    content: client.tls.phrase(user, "mode.voice_channels.limite_habilitar", client.emoji(0)),
                    flags: "Ephemeral"
                })
        }

        let dado = trigger;
        ({ dado, pagina_guia } = client.execute("switcher", { dado, operations, operacao }))
        await dado.save()

    } else if (operacao == 2 || operacao == 3) {

        let alvo = "voice_trigger#channel"
        let canal = client.decifer(trigger.config.channel)
        let cached_channel_type = ChannelType.GuildVoice

        if (operacao == 3) {
            alvo = "voice_trigger#category"
            canal = client.decifer(trigger.config.category)
            cached_channel_type = ChannelType.GuildCategory
        }

        if (operacao > 1) { // Definindo o canal ativador ou categoria para os canais de voz dinâmicos
            const data = {
                title: { tls: operacao == 2 ? "menu.menus.escolher_canal_ativador" : "menu.menus.escolher_categoria_canais" },
                pattern: "choose_channel",
                alvo: alvo,
                reback: `browse_button.voice_trigger_configure_button`,
                operation: operacao,
                submenu: `${hash_trigger}.${operacao}`,
                values: await client.execute("getGuildChannels", {
                    interaction,
                    user,
                    tipo: cached_channel_type,
                    id_configurado: canal
                })
            }

            // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
            if (data.values.length < pagina * 24) pagina--

            const row = client.execute("menu_navigation", { user, data, pagina })
            let botoes = [
                { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: reback },
                { id: "voice_trigger_configure_button", name: { tls: "menu.botoes.atualizar" }, type: 0, emoji: client.emoji(42), data: `${operacao}.${hash_trigger}` }
            ]

            if (!trigger.config.channel || !trigger.config.category) // Botão para cancelar a configuração do trigger
                botoes.push({ id: "voice_trigger_configure_button", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: `26.${hash_trigger}` })

            if (row.length > 0) // Botões de navegação
                botoes = botoes.concat(row)

            return client.reply(interaction, {
                components: [client.create_menus({ interaction, user, data, pagina }), client.create_buttons(botoes, interaction, user)],
                flags: "Ephemeral"
            })
        }

    } else if (operacao === 21) {

        // Define preferências do tamanho dos canais dinâmicos do trigger
        let limite_canal = []

        for (let i = 2; i <= 20; i++) {
            if (i !== parseInt(trigger.config.preferences.user_limit))
                limite_canal.push({ name: i, value: i })
        }

        if (trigger?.config.preferences.user_limit !== 0)
            limite_canal.unshift({ name: client.tls.phrase(user, "menu.botoes.remover_limite"), value: 0 })

        const data = {
            title: { tls: "menu.menus.escolher_limite_usuarios" },
            pattern: "numbers",
            alvo: "voice_trigger_channel_limit",
            submenu: `${hash_trigger}.${operacao}`,
            values: limite_canal
        }

        // Atualizando a mensagem original com o painel de controle do canal de voz
        const botoes = [{ id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: reback }]

        return client.reply(interaction, {
            components: [client.create_menus({ interaction, user, data }), client.create_buttons(botoes, interaction, user)],
            flags: "Ephemeral"
        })

    } else if (operacao === 23) {

        // Define o tema de nomes que serão utilizados para gerar os canais de voz
        let nomes_canal = []

        Object.keys(voice_names).forEach(key => {
            if (trigger.config.preferences.voice_names !== key)
                nomes_canal.push({ name: key, value: key, emoji: voice_names[key] })
        })

        const data = {
            title: { tls: "menu.menus.escolher_nome_canais" },
            pattern: "channel_names",
            alvo: "voice_trigger_channel_names",
            submenu: `${hash_trigger}.${operacao}`,
            values: nomes_canal
        }

        // Atualizando a mensagem original com o painel de controle do canal de voz
        const botoes = [{ id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: reback }]

        return client.reply(interaction, {
            components: [client.create_menus({ interaction, user, data }), client.create_buttons(botoes, interaction, user)],
            flags: "Ephemeral"
        })

    } else if (operacao === 25) {

        // Sub menu para confirmar a exclusão do trigger
        const row = client.create_buttons([
            { id: "voice_trigger_configure_button", name: { tls: "menu.botoes.confirmar" }, type: 1, emoji: client.emoji(10), data: `26.${hash_trigger}` },
            { id: "voice_trigger_configure_button", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: reback }
        ], interaction, user)

        return client.reply(interaction, {
            components: [row],
            flags: "Ephemeral"
        })

    } else if (operacao === 26) {

        // Excluindo o trigger selecionado
        await dropGuildVoiceTrigger(trigger.sid, trigger.hash)

        const triggers = (await listAllGuildVoiceTriggers(client.encrypt(interaction.guild.id))).length

        if (triggers > 0) {
            dados = "0.30" // Retorna ao sub menu com a lista de triggers do servidor
            return require("./guild_voice_channels_button")({ client, user, interaction, dados })
        } else {

            // Retornando ao painel principal do servidor cancelando a configuração dos canais de voz dinâmicos no servidor
            return require("../../../interactions/chunks/panel_guild")({ client, user, interaction, pagina_guia: 3 })
        }
    }

    require('../../chunks/voice_trigger_config')({ client, user, interaction, dados })
}