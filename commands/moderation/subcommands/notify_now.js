const { PermissionsBitField, ChannelType } = require('discord.js')

const { free_games } = require('../../../core/functions/free_games.js')

module.exports = async ({ client, user, interaction }) => {

    let guild = await client.getGuild(interaction.guild.id)

    if (!guild.games.channel || !guild.games.role)
        return client.tls.reply(interaction, user, "mode.anuncio.configuracao", true, 11)

    const canal = client.discord.channels.cache.get(guild.games.channel)

    if (canal) {
        if (canal.type === ChannelType.GuildText || canal.type === ChannelType.GuildAnnouncement) {

            // Permissão para enviar mensagens no canal
            if (await client.execute("permissions", { id_user: client.id(), permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel], canal })) {

                if (guild.conf.games) // Módulo de anúncios de games ativado
                    client.tls.reply(interaction, user, "mode.anuncio.anuncio_enviado_duplicatas", true, 29, `<#${guild.games.channel}>`)
                else // Módulo de anúncios de games desativado
                    client.tls.reply(interaction, user, "mode.anuncio.anuncio_enviado", true, 29, `<#${guild.games.channel}>`)

                // Enviando os games para anunciar no servidor
                const guild_channel = guild.games.channel
                free_games({ client, guild_channel })

            } else // Sem permissão para enviar mensagens no canal
                return client.tls.reply(interaction, user, "mode.anuncio.permissao_envio", true, client.defaultEmoji("guard"))

        } else // Tipo de canal inválido
            return client.tls.reply(interaction, user, "mode.anuncio.tipo_canal", true, client.defaultEmoji("types"))

    } else // Sem canal configurado
        return client.tls.reply(interaction, user, "mode.anuncio.configuracao", true, client.defaultEmoji("guard"))
}