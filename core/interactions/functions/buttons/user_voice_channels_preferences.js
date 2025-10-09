// 1 -> Define os membros para os canais privados
// 2 -> Ativar ou desativar a configuração para canais privados
// 3 -> Altera o tamanho dos canais de voz dinâmicos
// 4 -> Submenu para confirmar remoção de membros do canal

// 5 -> Confirma a remoção dos membros autorizados

const { dropVoiceChannelParty } = require('../../../database/schemas/User_voice_channel_party')

const operations = {
    2: { action: "misc.voice_channels.always_private", page: 0 },
    8: { action: "misc.voice_channels.global_config", page: 0 }
}

module.exports = async ({ client, user, interaction, dados }) => {

    let operacao = parseInt(dados.split(".")[1])

    if (operations[operacao]) {

        let dado = user;
        ({ dado, pagina_guia } = client.switcher({ dado, operations, operacao }))
        await dado.save()

    } else if (operacao == 1) {

        // Define os membros que poderão terão acesso ao canal dinâmico do membro
        const data = {
            title: { tls: "menu.menus.escolher_usuario" },
            pattern: "users",
            alvo: "user_voice_channel_party"
        }

        // Botão para retornar ao painel de configuração do canal de voz
        const row = client.create_buttons([
            { id: "user_voice_channels_preferences", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: "0" }
        ], interaction, user)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data }), row]
        })

    } else if (operacao === 3) {

        // Define preferências do tamanho dos canais dinâmicos do usuário
        let limite_canal = [], reback = "panel_personal_voice_channels"

        for (let i = 2; i <= 20; i++)
            if (i !== parseInt(user.misc.voice_channels.user_limit))
                limite_canal.push({ name: i, value: i })

        if (user.misc?.voice_channels.user_limit !== "0")
            limite_canal.unshift({ name: client.tls.phrase(user, "menu.botoes.remover_limite"), value: 0 })

        const data = {
            title: { tls: "menu.menus.escolher_limite_usuarios" },
            pattern: "numbers",
            alvo: "user_voice_channel_limit_preference",
            values: limite_canal
        }

        // Atualizando a mensagem original com o painel de controle do canal de voz
        const botoes = [{ id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: reback }]

        return client.reply(interaction, {
            components: [client.create_menus({ interaction, user, data }), client.create_buttons(botoes, interaction, user)],
            flags: "Ephemeral"
        })

    } else if (operacao === 4) {

        // Submenu para confirmar a remocação de acesso ao canal dinâmico pré-configurado
        const botoes = [
            { id: "user_voice_channels_preferences", name: { tls: "menu.botoes.confirmar" }, type: 2, emoji: client.emoji(10), data: "5" },
            { id: "user_voice_channels_preferences", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: "0" }
        ]

        return client.reply(interaction, {
            content: client.tls.phrase(user, user.misc.voice_channels.global_config ? "mode.voice_channels.confirmar_reset_users_global" : "mode.voice_channels.confirmar_reset_users_server", client.emoji(8)),
            components: [client.create_buttons(botoes, interaction, user)]
        })
    }

    // Confirmando a remoção dos membros do grupo por servidor ou globalmente
    if (operacao === 5) await dropVoiceChannelParty(user.uid, client.encrypt(interaction.guild.id), user.misc.voice_channels.global_config)

    // Redirecionando a função para o painel dos canais de voz dinâmicos
    require('../../chunks/panel_personal_voice_channels')({ client, user, interaction })
}