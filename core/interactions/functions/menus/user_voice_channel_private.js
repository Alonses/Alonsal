const { PermissionsBitField } = require("discord.js")

const { verifyVoiceChannel } = require("../../../database/schemas/User_voice_channel")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_canal = interaction.message.channelId
    const users = dados

    const voice_channel = await verifyVoiceChannel(client.encrypt(id_canal), client.encrypt(interaction.guild.id))
    if (interaction.user.id !== client.decifer(voice_channel.uid))
        return client.tls.reply(interaction, user, "mode.voice_channels.usuario_proibido", true, 7)

    const canal_server = await client.getGuildChannel(id_canal)

    if (canal_server) {

        const alteracoes = []

        if (users.length > 0) // Removendo a permissão de everyone poder conectar ao canal
            alteracoes.push(
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: client.id(),
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            )

        users.forEach(async user => {
            alteracoes.push({
                id: user,
                allow: [PermissionsBitField.Flags.ViewChannel]
            })
        })

        canal_server.permissionOverwrites.set(alteracoes)
            .then(() => {

                // Informando ao usuário sobre a alteração do limite de membros do canal concluída
                interaction.reply({ content: `:passport_control: | O canal foi privado para apenas alguns usuários poderem acessar.\n\n:white_check_mark: Os usuários liberados para acesso são: ${(users.map(id => `<@${id}>`)).join(", ")}`, flags: "Ephemeral" })

                dados = id_canal
                const update = true
                return require("../../chunks/voice_channel_config")({ client, user, interaction, dados, update })
            })
            .catch(() => interaction.reply({ content: client.tls.phrase(user, "mode.voice_channels.erro_alterar_limite", client.emoji(0)), flags: "Ephemeral" }))
    }
}