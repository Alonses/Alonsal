const { ChannelType } = require('discord.js')

const { voiceChannelTimeout } = require('../../../formatters/patterns/timeout')

const { registryVoiceChannel } = require('../../../database/schemas/User_voice_channel')

// 1 -> Ativar ou desativar os canais de voz dinâmicos
// 2 -> Altera o canal gatilho
// 3 -> Altera a categoria dos canais de voz dinâmicos
// 4 -> Altera o tempo de expiração dos canais de voz
// 5 -> Altera o status de som de pop up ao mutar membros

// 6 -> Converte o canal de voz atual do membro em um canal dinâmico
// 7 -> Confirma a alteração do canal atual para canal de voz dinâmico

const operations = {
    1: { action: "conf.voice_channels", page: 0 },
    5: { action: "voice_channels.mute_popup", page: 0 }
}

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_voice_channels"
    let guild = await client.getGuild(interaction.guild.id)

    if (operations[operacao]) {
        ({ guild, pagina_guia } = client.switcher({ guild, operations, operacao }))
        await guild.save()
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
            { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: reback }
        ], interaction)

        return client.reply(interaction, {
            components: [client.create_menus({ interaction, user, data }), row],
            flags: "Ephemeral"
        })

    } else if (operacao == 2 || operacao == 3) {

        if (!guild.voice_channels.channel) operacao = 2
        else if (!guild.voice_channels.category) operacao = 3

        let alvo = "guild_voice_channels#channel"
        let canal = client.decifer(guild.voice_channels.channel)
        let cached_channel_type = ChannelType.GuildVoice

        if (operacao == 3) {
            alvo = "guild_voice_channels#category"
            canal = client.decifer(guild.voice_channels.category)
            cached_channel_type = ChannelType.GuildCategory
        }

        if (operacao > 1) { // Definindo o canal ativador ou categoria para os canais de voz dinâmicos
            const data = {
                title: { tls: operacao == 2 ? "menu.menus.escolher_canal_ativador" : "menu.menus.escolher_categoria_canais" },
                pattern: "choose_channel",
                alvo: alvo,
                reback: "browse_button.guild_voice_channel_button",
                operation: operacao,
                values: await client.getGuildChannels(interaction, user, cached_channel_type, canal)
            }

            // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
            if (data.values.length < pagina * 24) pagina--

            const row = client.menu_navigation(user, data, pagina || 0)
            let botoes = [
                { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: reback },
                { id: "guild_voice_channels_button", name: { tls: "menu.botoes.atualizar", alvo: user }, type: 1, emoji: client.emoji(42), data: operacao }
            ]

            if (row.length > 0) // Botões de navegação
                botoes = botoes.concat(row)

            return client.reply(interaction, {
                components: [client.create_menus({ interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
                flags: "Ephemeral"
            })
        }

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
                { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: reback },
                { id: "guild_voice_channels_button", name: { tls: "menu.botoes.confirmar", alvo: user }, type: 1, emoji: client.emoji(10), data: "7" }
            ]

            return client.reply(interaction, {
                embeds: [embed],
                components: [client.create_buttons(botoes, interaction)],
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
    }

    // Redirecionando a função para o painel dos canais de voz dinâmicos
    require('../../chunks/panel_guild_voice_channels')({ client, user, interaction })
}