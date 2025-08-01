const { ChannelType, PermissionsBitField } = require("discord.js")

const { verifyUserVoiceChannel, registryVoiceChannel, verifyVoiceChannel } = require("../../../database/schemas/User_voice_channel")

const { voiceChannelTimeout } = require("../../../formatters/patterns/timeout")

module.exports = async ({ client, guild, oldState, newState }) => {

    const id_user = oldState.id

    // Membro do servidor entrou no canal ativador
    if (newState.channelId === client.decifer(guild.voice_channels.channel)) {

        let user_voice = await verifyUserVoiceChannel(client.encrypt(id_user), client.encrypt(guild.sid))

        // Verificando se já existe um canal criado para o membro no servidor
        if (!user_voice) {

            const user_voice_channel = await registryVoiceChannel(client.encrypt(id_user), client.encrypt(guild.sid))

            // Verificando se a categoria informada existe
            if (await client.getGuildChannel(client.decifer(guild.voice_channels.category))) {

                const guild_member = await client.getMemberGuild(guild.sid, id_user)
                const cached_guild = await client.guilds(guild.sid)
                const phonetic_alphabet = require('../../../../files/json/text/phonetic_alphabet.json')

                // Criando o canal dinâmico na categoria definida no servidor
                await cached_guild.channels.create({
                    name: `${client.defaultEmoji("person")} ${phonetic_alphabet[client.random(27)]}`,
                    type: ChannelType.GuildVoice,
                    parent: client.decifer(guild.voice_channels.category),
                    permissionOverwrites: [
                        {
                            id: guild.sid,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
                        },
                        {
                            id: guild.sid,
                            deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        },
                        {
                            id: id_user,
                            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        },
                        {
                            id: client.id(),
                            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        }
                    ]
                }).then(async new_voice_channel => {

                    // Atualizando as estatísticas de canais dinâmicos criados no dia
                    client.journal("voice_channel")

                    // Permissões do bot no servidor
                    const membro_sv = await client.getMemberGuild(guild.sid, client.id())
                    if (membro_sv.permissions.has(PermissionsBitField.Flags.MoveMembers)) {

                        setTimeout(() => { // Movendo o membro para o novo canal
                            guild_member.voice.setChannel(new_voice_channel.id)
                                .catch(() => verificar_ausencia_canal(client, new_voice_channel.id, new_voice_channel.id, guild))
                        }, 500)

                        // Atualizandos os dados do canal no banco de dados
                        user_voice_channel.cid = client.encrypt(new_voice_channel.id)
                        await user_voice_channel.save()

                        const user = await client.getUser(id_user)
                        const dados = `${new_voice_channel.id}.${guild.sid}`
                        require("../../../interactions/chunks/voice_channel_config")({ client, user, dados })
                    }
                })
            }
        } else { // Membro já criou um canal, movendo ele para o canal criado se entrar no canal ativador novamente
            const guild_member = await client.getMemberGuild(guild.sid, id_user)
            guild_member.voice.setChannel(client.decifer(user_voice.cid))
                .catch(() => () => verificar_ausencia_canal(client, client.decifer(user_voice.cid), client.decifer(user_voice.cid), guild))
        }
    } else  // Verifica se o canal possui ausencia de membros
        verificar_ausencia_canal(client, oldState.channelId, newState.channelId, guild)
}

async function verificar_ausencia_canal(client, channel_id, new_channel, guild) {

    // Dono original saiu do canal dinâmico
    const voice_channel = await verifyVoiceChannel(client.encrypt(channel_id), client.encrypt(guild.sid))

    // Verificando se o canal dinâmico existe e se o novo canal de entrada é diferente do canal ativador no servidor
    if (voice_channel && new_channel !== client.decifer(guild.voice_channels.channel)) {

        const guild_channel = await client.getGuildChannel(channel_id)

        // Excluindo o canal se estiver vazio
        if (guild_channel && guild_channel?.members?.size < 1) {
            voice_channel.delete()

            // Alterando o nome do canal para informar a exclusão
            await guild_channel.edit({
                name: `${client.emoji(13)} ${guild_channel.name.split(" ")[1]}`
            })

            // Notificando sobre a exclusão do canal no chat de mensagens
            client.notify(guild_channel.id, { content: `${client.emoji(13)} | Este canal será excluído <t:${(client.timestamp() + voiceChannelTimeout[guild.voice_channels.timeout])}:R>` })

            setTimeout(() => {
                guild_channel.delete()
            }, voiceChannelTimeout[guild.voice_channels.timeout] * 1000)
        }
    }

    // Verificando se já existe algum canal criado e o membro
    if (voice_channel && new_channel === client.decifer(guild.voice_channels.channel)) return mover_membro(client, voice_channel)
}

async function mover_membro(client, voice_channel) {

    // Movendo o membro de volta ao canal que ele havia criado
    const guild_member = await client.getMemberGuild(client.decifer(voice_channel.sid), client.decifer(voice_channel.uid))

    setTimeout(() => {
        guild_member.voice.setChannel(client.decifer(voice_channel.cid))
            .catch(async () => {
                const guild = await client.getGuild(client.decifer(voice_channel.sid))
                verificar_ausencia_canal(client, client.decifer(voice_channel.cid), client.decifer(voice_channel.cid), guild)
            })
    }, 500)
}