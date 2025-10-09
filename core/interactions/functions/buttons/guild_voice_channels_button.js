const { registryVoiceChannel } = require('../../../database/schemas/User_voice_channel')
const { getGuildVoiceTrigger, listAllGuildVoiceTriggers } = require('../../../database/schemas/Voice_triggers')

const { voiceChannelTimeout } = require('../../../formatters/patterns/timeout')

const operations = {
    1: { action: "conf.voice_channels", page: 0 },
    5: { action: "voice_channels.preferences.mute_popup", page: 0 },
    22: { action: "voice_channels.preferences.always_private", page: 1 },
    24: { action: "voice_channels.preferences.allow_text", page: 1 },
    25: { action: "voice_channels.preferences.allow_preferences", page: 1 }
}

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])
    let guild = await client.getGuild(interaction.guild.id), reback = "panel_guild_voice_channels"

    // Tratamento dos cliques

    // 1 -> Ativar ou desativar os canais de voz dinâmicos
    // 4 -> Altera o tempo de expiração dos canais de voz
    // 5 -> Altera o status de som de pop up ao mutar membros

    // 6 -> Converte o canal de voz atual do membro em um canal dinâmico
    // 7 -> Confirma a alteração do canal atual para canal de voz dinâmico

    // 20 -> Sub menu para editar preferências dos canais no servidor
    // 25 -> Define se as customizações dos usuários serão aplicadas aos canais

    // 30 -> Sub menu para listar outros ativadores de canais de voz dinâmicos
    // 31 -> Cria um novo trigger no servidor

    if (operations[operacao]) {

        let dado = guild;
        ({ dado, pagina_guia } = client.switcher({ dado, operations, operacao }))
        await dado.save()

    } else if (operacao === 4) {

        // Submenu para escolher o tempo de expiração dos canais de voz dinâmicos
        const valores = []
        Object.keys(voiceChannelTimeout).forEach(key => { if (parseInt(key) !== guild.voice_channels.timeout) valores.push(`${key}.${voiceChannelTimeout[key]}`) })

        const data = {
            title: { tls: "menu.menus.escolher_tempo_remocao" },
            pattern: "numbers",
            alvo: "guild_voice_channels_timeout",
            values: valores
        }

        let row = client.create_buttons([
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: reback }
        ], interaction, user)

        return client.reply(interaction, {
            components: [client.create_menus({ interaction, user, data }), row],
            flags: "Ephemeral"
        })

    } else if (operacao == 6 || operacao == 7) {

        // Converte o canal onde o membro está conectado atualmente em um canal de voz dinâmico
        if (operacao == 6) {

            const embed = client.create_embed({
                title: `> ${client.tls.phrase(user, "mode.voice_channels.title_voice")} 🔊`,
                description: { tls: "mode.voice_channels.converter_canal" },
                footer: {
                    text: "⠀",
                    iconURL: interaction.user.avatarURL({ dynamic: true })
                }
            }, user)

            const botoes = [
                { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: reback },
                { id: "guild_voice_channels_button", name: { tls: "menu.botoes.confirmar" }, type: 1, emoji: client.emoji(10), data: "7" }
            ]

            return client.reply(interaction, {
                embeds: [embed],
                components: [client.create_buttons(botoes, interaction, user)],
                flags: "Ephemeral"
            })

        } else {

            // Promovendo o canal a um canal de voz dinâmico
            if (interaction.member.voice.channel) {

                const guild_channel = await client.getGuildChannel(interaction.member.voice.channel.id)

                if (guild_channel) {

                    // Salvando o canal dinâmico em cache
                    client.cached.voice_channels.set(`${client.encrypt(interaction.member.voice.channel.id)}.${client.encrypt(interaction.guild.id)}`, true)

                    // Alterando o nome do canal para informar a exclusão
                    await guild_channel.edit({ name: `${client.defaultEmoji("person")} ${guild_channel.name}` })
                        .then(async () => {

                            const user_voice_channel = await registryVoiceChannel(client.encrypt(interaction.user.id), client.encrypt(interaction.guild.id))

                            user_voice_channel.cid = client.encrypt(guild_channel.id)
                            await user_voice_channel.save()

                            const user = await client.getUser(interaction.user.id)
                            const dados = `${guild_channel.id}.${interaction.guild.id}`
                            require("../../../interactions/chunks/voice_channel_config")({ client, user, dados })
                        })
                        .catch(() => interaction.reply({ content: client.tls.phrase(user, "mode.voice_channels.falha_converter_canal", client.emoji(0)), flags: "Ephemeral" }))
                }
            }
        }

    } else if (operacao === 30) {

        // Sub menu para poder configurar outros ativadores de voz no servidor
        const triggers = await listAllGuildVoiceTriggers(client.encrypt(interaction.guild.id))

        // Submenu para navegar pelos strikes do servidor
        let botoes = [], segunda_linha = [], row = [{ id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: "panel_guild_voice_channels.0" }]

        if (triggers.length < 1) {
            const trigger = await getGuildVoiceTrigger(client, client.encrypt(interaction.guild.id))

            botoes.push({ id: "voice_trigger_configure_button", name: "1°", type: 1, emoji: client.emoji("mc_approve"), data: `0|${trigger.hash}` })
        } else
            triggers.forEach(trigger => {

                const botao = { id: "voice_trigger_configure_button", name: `${trigger.config.category_nick ? client.decifer(trigger.config.category_nick) : client.tls.phrase(user, "mode.spam.sem_categoria")}`, type: 1, emoji: client.emoji(trigger.config.active ? "mc_approve" : "mc_oppose"), data: `0|${trigger.hash}` }

                if (botoes.length < 5) botoes.push(botao)
                else segunda_linha.push(botao)
            })

        if (triggers.length < (guild.misc.subscription.active ? 10 : 2)) // Botão para adicionar um novo trigger
            row.push({ id: "guild_voice_channels_button", name: { tls: "menu.botoes.novo_ativador" }, type: 2, emoji: client.emoji(43), data: 31 })

        const embed = client.create_embed({
            title: { tls: "mode.voice_channels.configurando_ativadores" },
            description: { tls: "mode.voice_channels.descricao_ativadores", replace: `${client.emoji(48)} **${client.tls.phrase(user, "menu.botoes.ativadores")} ( ${triggers.length} / ${guild.misc.subscription.active ? 10 : 2} )**` },
            footer: {
                text: { tls: "mode.warn.customizacao_rodape" },
                iconURL: interaction.user.avatarURL({ dynamic: true })
            }
        }, user)

        const obj = {
            content: "",
            embeds: [embed],
            components: [client.create_buttons(botoes, interaction, user)],
            flags: "Ephemeral"
        }

        if (segunda_linha.length > 0) // Acrescentando a segunda linha de triggers para seleção
            obj.components.push(client.create_buttons(segunda_linha, interaction, user))

        // Linha de botões para navegação no menu
        obj.components.push(client.create_buttons(row, interaction, user))

        return interaction.update(obj)

    } else if (operacao === 31) {

        // Criando um novo trigger no servidor
        const guild = await client.getGuild(interaction.guild.id)
        const triggers = await listAllGuildVoiceTriggers(client.encrypt(interaction.guild.id))

        // Criando um novo trigger no servidor
        if (triggers.length < guild.misc.subscription.active ? 10 : 3) {
            const trigger = await getGuildVoiceTrigger(client, client.encrypt(interaction.guild.id))
            dados = `0.0.${trigger.hash}`

            return require('./voice_trigger_configure_button')({ client, user, interaction, dados })
        } else
            return client.reply(interaction, {
                content: client.tls.phrase(user, "mode.voice_channels.limite_triggers", client.emoji(0)),
                flags: "Ephemeral"
            })
    }

    // Redirecionando a função para o painel dos canais de voz dinâmicos
    require('../../chunks/panel_guild_voice_channels')({ client, user, interaction })
}