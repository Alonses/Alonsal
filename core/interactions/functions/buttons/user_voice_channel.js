const { verifyUserVoiceChannel, verifyVoiceChannel } = require("../../../database/schemas/User_voice_channel")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_dono = dados.split(".")[3]
    const id_canal = dados.split(".")[2]
    const escolha = parseInt(dados.split(".")[1])

    // Tratamento dos cliques
    // 1 -> Definir limite para o canal
    // 2 -> Tornar canal privado
    const voice_channel = await verifyVoiceChannel(client.encrypt(id_canal), client.encrypt(interaction.guild.id))

    if (!await verifyUserVoiceChannel(client.encrypt(interaction.user.id), client.encrypt(interaction.guild.id)))
        return client.tls.reply(interaction, user, "mode.voice_channels.canal_desconhecido", true, 1)

    if (interaction.user.id !== client.decifer(voice_channel.uid))
        return client.tls.reply(interaction, user, "mode.voice_channels.usuario_proibido", true, 7)

    if (escolha === 1) {

        // Definindo o limite de membros para o canal
        const guild_channel = await client.getGuildChannel(id_canal)
        let limite_canal = []

        for (let i = 2; i <= 15; i++) {
            if (i !== guild_channel.userLimit)
                limite_canal.push({ name: i, value: `${i}.${id_canal}` })
        }

        if (guild_channel.userLimit !== 0)
            limite_canal.unshift({ name: client.tls.phrase(user, "menu.botoes.remover_limite"), value: `0.${id_canal}` })

        const data = {
            title: { tls: "menu.menus.escolher_limite_usuarios" },
            pattern: "numbers",
            alvo: "user_voice_channel_limit",
            values: limite_canal
        }

        const row = client.create_buttons([
            { id: "user_voice_channel", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `0.${id_canal}` }
        ], interaction)

        // Atualizando a mensagem original com o painel de controle do canal de voz
        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data }), row]
        })
    }

    dados = id_canal
    const update = true
    require("../../chunks/voice_channel_config")({ client, user, interaction, dados, update })
}