// 1 -> Ativar ou desativar os canais de voz dinâmicos
// 2 -> Altera o canal gatilho
// 3 -> Altera a categoria dos canais de voz dinâmicos

const { ChannelType } = require('discord.js')
const { voiceChannelTimeouts } = require('../../../formatters/patterns/timeout')

const operations = {
    1: { action: "conf.voice_channels", page: 0 }
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
        Object.keys(voiceChannelTimeouts).forEach(key => { if (parseInt(key) !== guild.voice_channels.timeout) valores.push(`${key}.${voiceChannelTimeouts[key]}`) })

        const data = {
            title: { tls: "menu.menus.escolher_tempo_remocao" },
            pattern: "numbers",
            alvo: "guild_voice_channels_timeout",
            values: valores
        }

        let row = client.create_buttons([{
            id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback
        }], interaction)

        return client.reply(interaction, {
            components: [client.create_menus({ client, interaction, user, data }), row],
            flags: "Ephemeral"
        })

    } else {

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
                title: { tls: "menu.menus.escolher_canal" },
                pattern: "choose_channel",
                alvo: alvo,
                reback: "browse_button.guild_voice_channel_button",
                operation: operacao,
                values: await client.getGuildChannels(interaction, user, cached_channel_type, canal)
            }

            // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
            if (data.values.length < pagina * 24) pagina--

            let botoes = [
                { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback },
                { id: "guild_voice_channels_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: operacao }
            ]

            let row = client.menu_navigation(user, data, pagina || 0)

            if (row.length > 0) // Botões de navegação
                botoes = botoes.concat(row)

            return client.reply(interaction, {
                components: [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
                flags: "Ephemeral"
            })
        }
    }

    // Redirecionando a função para o painel dos canais de voz dinâmicos
    require('../../chunks/panel_guild_voice_channels')({ client, user, interaction })
}