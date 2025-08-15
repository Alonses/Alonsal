const { ChannelType, PermissionsBitField } = require("discord.js")

const { verifyUserVoiceChannel, registryVoiceChannel, verifyVoiceChannel } = require("../../../database/schemas/User_voice_channel")

const voice_channel_config = require("../../../interactions/chunks/voice_channel_config")

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
                const { nicknames } = require('../../../../files/json/text/nicknames.json')

                // Criando o canal dinâmico na categoria definida no servidor
                await cached_guild.channels.create({
                    name: `${client.defaultEmoji("person")} ${nicknames[client.random(nicknames)]}`,
                    type: ChannelType.GuildVoice,
                    parent: client.decifer(guild.voice_channels.category),
                    permissionOverwrites: [
                        {
                            id: guild.sid,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ReadMessageHistory]
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

                        // Salvando o canal de voz dinâmico em cache
                        client.cached.voice_channels.set(`${client.encrypt(new_voice_channel.id)}.${client.encrypt(new_voice_channel.guild.id)}`, true)

                        const user = await client.getUser(id_user)
                        const dados = `${new_voice_channel.id}.${guild.sid}`
                        require("../../../interactions/chunks/voice_channel_config")({ client, user, dados })
                    }
                })
            }
        } else { // Membro já criou um canal, movendo ele para o canal criado se entrar no canal ativador novamente
            const guild_member = await client.getMemberGuild(guild.sid, id_user)
            guild_member.voice.setChannel(client.decifer(user_voice.cid))
                .catch(() => () => verificar_ausencia_canal(client, client.decifer(user_voice.cid), client.decifer(user_voice.cid), guild, id_user))
        }
    } else if (oldState.channelId !== newState.channelId) // Verifica se o canal possui ausencia de membros
        verificar_ausencia_canal(client, oldState.channelId, newState.channelId, guild, id_user)
}

async function verificar_ausencia_canal(client, channel_id, new_channel, guild, id_user) {

    // Dono original saiu do canal dinâmico
    const voice_channel = await verifyVoiceChannel(client.encrypt(channel_id), client.encrypt(guild.sid))

    // Verificando se o canal dinâmico existe e se o novo canal de entrada é diferente do canal ativador no servidor
    if (voice_channel && new_channel !== client.decifer(guild.voice_channels.channel)) {

        const guild_channel = await client.getGuildChannel(channel_id)

        // Excluindo o canal se estiver vazio
        if (guild_channel && guild_channel?.members?.size < 1) {

            // Removendo o canal do cache e do banco de dados
            client.cached.voice_channels.delete(`${voice_channel.cid}.${voice_channel.sid}`)
            voice_channel.delete()

            // Alterando o nome do canal para informar a exclusão
            await guild_channel.edit({
                name: `${client.emoji(13)} ${guild_channel.name.split(" ")[1]}`
            })

            const user = await client.getUser(id_user)

            // Notificando sobre a exclusão do canal no chat de mensagens
            client.notify(guild_channel.id, { content: client.tls.phrase(user, "mode.voice_channels.aviso_exclusao", 13, client.timestamp() + voiceChannelTimeout[guild.voice_channels.timeout]) })

            setTimeout(() => {
                guild_channel.delete()
            }, voiceChannelTimeout[guild.voice_channels.timeout] * 1000)

        } else if (client.decifer(voice_channel.uid) === id_user) {

            // Ativa apenas quando o dono do canal desconecta e transfere os controles para outro membro conectado
            transferir_controles({ client, guild_channel, voice_channel })
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

async function transferir_controles({ client, guild_channel, voice_channel }) {

    const new_channel_owner = [...guild_channel.members.keys()][0]
    const user = await client.getUser(new_channel_owner)

    voice_channel.uid = client.encrypt(new_channel_owner)
    await voice_channel.save()

    setTimeout(() => {
        // Atualizando o card de mensagem para o novo dono do canal
        const dados = `${guild_channel.id}.${guild_channel.guild.id}`, update = true
        voice_channel_config({ client, user, dados, update })
    }, 1000)
}