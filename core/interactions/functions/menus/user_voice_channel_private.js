const { PermissionsBitField, OverwriteType } = require("discord.js")

const { verifyVoiceChannel } = require("../../../database/schemas/User_voice_channel")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_canal = interaction.message.channelId
    const users = dados

    const voice_channel = await verifyVoiceChannel(client.encrypt(id_canal), client.encrypt(interaction.guild.id))
    if (interaction.user.id !== client.decifer(voice_channel.uid))
        return client.tls.reply(interaction, user, "mode.voice_channels.usuario_proibido", true, 7)

    const canal_server = await client.getGuildChannel(id_canal)

    if (canal_server) {

        const alteracoes = [], alteracoes_cache = {}
        const permissoes = canal_server.permissionOverwrites.cache // Coletando overwrites do canal

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

        alteracoes_cache[interaction.guild.id] = true
        alteracoes_cache[client.id()] = true

        users.forEach(async user => {

            // Verificando se há um overwrite já configurado no canal e removendo o mesmo
            if (canal_server.permissionOverwrites.cache.has(user))
                canal_server.permissionOverwrites.delete(user)
            else {
                alteracoes.push({
                    id: user,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                })
            }

            alteracoes_cache[user] = true
        })

        permissoes.forEach(overwrite => {

            // Incluindo overwrites prévios que não foram alterados no canal
            if (!alteracoes_cache[overwrite.id])
                alteracoes.push({
                    id: overwrite.id,
                    allow: overwrite.allow.toArray(),
                    deny: overwrite.deny.toArray(),
                    type: OverwriteType.Member
                })
        })

        canal_server.permissionOverwrites.set(alteracoes)
            .then(() => {

                // Informando ao usuário sobre a alteração do limite de membros do canal concluída
                client.tls.reply(interaction, user, "mode.voice_channels.aviso_canal_privado", true, 7, client.list(users.map(id => `<@${id}>`), null, true))

                dados = id_canal
                const update = true
                return require("../../chunks/voice_channel_config")({ client, user, interaction, dados, update })
            })
            .catch(() => interaction.reply({ content: client.tls.phrase(user, "mode.voice_channels.erro_alterar_limite", client.emoji(0)), flags: "Ephemeral" }))
    }
}