const { verifyVoiceChannel } = require("../../../database/schemas/User_voice_channel")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_canal = dados.split(".")[1]
    const novo_limite = parseInt(dados.split(".")[0])

    const voice_channel = await verifyVoiceChannel(client.encrypt(id_canal), client.encrypt(interaction.guild.id))
    if (interaction.user.id !== client.decifer(voice_channel.uid))
        return client.tls.reply(interaction, user, "mode.voice_channels.usuario_proibido", true, 7)

    const canal_server = await client.getGuildChannel(id_canal)

    if (canal_server)
        canal_server.setUserLimit(novo_limite)
            .then(() => {

                // Informando ao usuário sobre a alteração do limite de membros do canal concluída
                client.tls.reply(interaction, user, "mode.voice_channels.limite_usuario_atualizado", true, 43)

                dados = id_canal
                const update = true
                return require("../../chunks/voice_channel_config")({ client, user, interaction, dados, update })
            })
            .catch(() => interaction.update({ content: client.tls.phrase(user, "mode.voice_channels.erro_alterar_limite"), flags: "Ephemeral", components: [] }))
}