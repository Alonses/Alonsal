const { ChannelType, PermissionsBitField, OverwriteType } = require("discord.js")

const { verifyUserParty } = require("../../../database/schemas/User_voice_channel_party")
const { listAllGuildVoiceTriggers, getVoiceTriggerByChannelId } = require("../../../database/schemas/Voice_triggers")
const { verifyUserVoiceChannel, registryVoiceChannel, verifyVoiceChannel, dropVoiceChannelById } = require("../../../database/schemas/User_voice_channel")
const { removeCanalDinamico } = require("../../../auto/triggers/guild_voice_channels")

const { voice_names } = require("../../../formatters/patterns/guild")
const { voiceChannelTimeout } = require("../../../formatters/patterns/timeout")

module.exports = async ({ client, guild, oldState, newState }) => {

    const id_user = oldState.id
    const guild_triggers = await listAllGuildVoiceTriggers(client.encrypt(guild.sid), true)
    let triggers = []

    // Listando todos os triggers do servidor para verificação
    guild_triggers.forEach(trigger => { triggers.push(trigger.config.channel) })

    // Membro do servidor entrou no canal ativador
    if (triggers.includes(newState.channelId)) {

        let user_voice = await verifyUserVoiceChannel(client.encrypt(id_user), client.encrypt(guild.sid), client.encrypt(newState.channelId))
        const user_old_voice = await verifyVoiceChannel(client.encrypt(oldState.channelId), client.encrypt(guild.sid))

        // Verificando se o membro saiu de um canal gerado por outro trigger
        if (user_old_voice && client.decifer(user_old_voice?.conf.trigger) !== newState.channelId) verificar_ausencia_canal(client, oldState.channelId, oldState.channelId, guild, id_user, triggers)

        // Verificando se já existe um canal criado para o membro no servidor
        if (!user_voice) {

            const trigger = await getVoiceTriggerByChannelId(client.encrypt(guild.sid), client.encrypt(newState.channelId))

            if (!trigger || !await client.getGuildChannel(trigger.config.category))
                console.warn(`🛑 | Canal dinâmico não criado no servidor ${guild.sid}: ${!trigger ? "trigger não encontrado para o canal" : "categoria do trigger inexistente ou ilegível"} (${newState.channelId})`)

            // Verificando se a categoria informada existe
            if (trigger && await client.getGuildChannel(trigger.config.category)) {

                const user_voice_channel = await registryVoiceChannel(client.encrypt(id_user), client.encrypt(guild.sid))
                const cached_guild = await client.guilds(guild.sid)

                const guild_member = await client.execute("getMemberGuild", { interaction: guild.sid, id_user })
                const user = await client.execute("getUser", { id_user })

                // Escolhendo um nome aleatório conforme o tema definido no servidor
                const chave_nome = trigger.config.preferences.voice_names === "all" ? client.execute("random", { intervalo: voice_names, raw: true, ignore: "all" }) : trigger.config.preferences.voice_names
                const nome_canal = client.tls.phrase(user, `voice_channels.${chave_nome}`)

                const obj = {
                    name: `${client.defaultEmoji("person")} ${nome_canal}`,
                    type: ChannelType.GuildVoice,
                    parent: trigger.config.category,
                    userLimit: guild?.voice_channels.preferences.allow_preferences ? user?.misc.voice_channels.user_limit : trigger.config.preferences.user_limit || 0,
                    permissionOverwrites: [
                        {
                            id: guild.sid,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ReadMessageHistory]
                        }
                    ]
                }

                if (!trigger.config.preferences.allow_text) // Desautorizando os membros a enviarem mensagens no canal de voz
                    obj.permissionOverwrites.push({ id: guild.sid, deny: [PermissionsBitField.Flags.SendMessages] })

                if (trigger.config.preferences.always_private || (user?.misc.voice_channels.always_private && guild.voice_channels.preferences.allow_preferences)) {
                    obj.permissionOverwrites.push(
                        {
                            id: guild.sid,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        },
                        {
                            id: id_user,
                            allow: [PermissionsBitField.Flags.ViewChannel]
                        }
                    )

                    // Coletando dados sobre membros autorizados a conectarem no canal de voz dinâmico
                    const userParty = await verifyUserParty(user.uid, client.encrypt(guild.sid), user?.misc.voice_channels.global_config)

                    // Listando todos os membros autorizados a verem o novo canal
                    userParty.forEach(membro => {

                        obj.permissionOverwrites.push(
                            {
                                id: client.decifer(membro.mid),
                                allow: [PermissionsBitField.Flags.ViewChannel],
                                type: OverwriteType.Member
                            }
                        )
                    })
                }

                // Criando o canal dinâmico na categoria definida no servidor
                const created_channel = await cached_guild.channels.create(obj).catch(err => {
                    console.error(`🛑 | Falha ao criar o canal dinâmico no servidor ${guild.sid}:`, err?.message || err)
                    return null
                })

                if (!created_channel) return dropVoiceChannelById(user_voice_channel._id)

                // Registrando o canal no banco antes das demais etapas, assim ele sempre poderá ser excluído depois
                user_voice_channel.cid = client.encrypt(created_channel.id)
                user_voice_channel.conf.trigger = client.encrypt(newState.channelId)
                await user_voice_channel.save()

                client.cached.voice_channels.set(`${user_voice_channel.cid}.${user_voice_channel.sid}`, true)

                await Promise.resolve(created_channel).then(async new_voice_channel => {

                    // Atualizando as estatísticas de canais dinâmicos criados no dia
                    client.journal("voice_channel", 1)

                    // Permissões do bot no servidor
                    const membro_sv = await client.execute("getMemberGuild", { interaction: guild.sid, id_user: client.id() })
                    if (membro_sv.permissions.has(PermissionsBitField.Flags.MoveMembers)) {

                        setTimeout(() => { // Movendo o membro para o novo canal
                            guild_member.voice.setChannel(new_voice_channel.id)
                                .catch(() => verificar_ausencia_canal(client, new_voice_channel.id, new_voice_channel.id, guild, null, triggers))
                        }, 500)

                        const user = await client.execute("getUser", { id_user })
                        const dados = `${new_voice_channel.id}.${guild.sid}`
                        require("../../../interactions/chunks/voice_channel_config")({ client, user, dados })
                    }
                })
            }
        } else { // Membro já criou um canal, movendo ele para o canal criado se entrar no canal ativador novamente
            const guild_member = await client.execute("getMemberGuild", { interaction: guild.sid, id_user })
            guild_member.voice.setChannel(client.decifer(user_voice.cid))
                .catch(() => verificar_ausencia_canal(client, client.decifer(user_voice.cid), client.decifer(user_voice.cid), guild, id_user, triggers))
        }
    } else if (oldState.channelId !== newState.channelId) // Verifica se o canal possui ausencia de membros
        verificar_ausencia_canal(client, oldState.channelId, newState.channelId, guild, id_user, triggers)
}

async function verificar_ausencia_canal(client, channel_id, new_channel, guild, id_user, triggers = []) {

    // Dono original saiu do canal dinâmico
    const voice_channel = await verifyVoiceChannel(client.encrypt(channel_id), client.encrypt(guild.sid))

    // Verificando se o canal dinâmico existe e se o novo canal de entrada é diferente do canal ativador no servidor
    if (voice_channel && !triggers.includes(new_channel)) {

        const guild_channel = await client.getGuildChannel(channel_id)

        // Excluindo o canal se estiver vazio ou se ele não existe mais no Discord
        if (!guild_channel || guild_channel.members?.size < 1) {

            const timeout = voiceChannelTimeout[guild.voice_channels.timeout]
            const user = await client.execute("getUser", { id_user: id_user || client.decifer(voice_channel.uid) })

            removeCanalDinamico(client, voice_channel, {
                delay: timeout * 1000,
                onSchedule: () => // Notificando sobre a exclusão do canal no chat de mensagens
                    client.execute("notify", {
                        id_canal: channel_id,
                        conteudo: { content: client.tls.phrase(user, "mode.voice_channels.aviso_exclusao", 13, client.execute("timestamp") + timeout) }
                    })
            })

        } else if (client.decifer(voice_channel.uid) === id_user) {

            // Ativa apenas quando o dono do canal desconecta e transfere os controles para outro membro conectado
            transferir_controles({ client, guild_channel, voice_channel })
        }
    }

    // Verificando se já existe algum canal criado e o membro
    if (voice_channel && triggers.includes(new_channel)) return mover_membro(client, voice_channel)
}

async function mover_membro(client, voice_channel) {

    // Movendo o membro de volta ao canal que ele havia criado
    const guild_member = await client.execute("getMemberGuild", { interaction: client.decifer(voice_channel.sid), id_user: client.decifer(voice_channel.uid) })

    setTimeout(() => {
        guild_member.voice.setChannel(client.decifer(voice_channel.cid))
            .catch(async () => {
                const guild = await client.getGuild(client.decifer(voice_channel.sid))
                verificar_ausencia_canal(client, client.decifer(voice_channel.cid), client.decifer(voice_channel.cid), guild)
            })
    }, 500)
}

async function transferir_controles({ client, guild_channel, voice_channel }) {

    const new_channel_owner = [...guild_channel?.members.keys()][0]

    // Verificando se não há um novo dono para o canal
    if (!new_channel_owner) return

    const user = await client.execute("getUser", { id_user: new_channel_owner })

    voice_channel.uid = client.encrypt(new_channel_owner)
    await voice_channel.save()

    setTimeout(() => {
        // Atualizando o card de mensagem para o novo dono do canal
        const dados = `${guild_channel.id}.${guild_channel.guild.id}`, update = true
        require("../../../interactions/chunks/voice_channel_config")({ client, user, dados, update })
    }, 1000)
}