const { ChannelType, PermissionsBitField, EmbedBuilder } = require("discord.js")

const { verifyUserVoiceChannel, registryVoiceChannel, verifyVoiceChannel } = require("../../../database/schemas/User_voice_channel")

const { voiceChannelTimeouts } = require("../../../formatters/patterns/timeout")

module.exports = async ({ client, guild, oldState, newState }) => {

    const id_user = oldState.id

    // Membro entrou do servidor entrou em um canal
    if (oldState.channelId === null && newState.channelId !== null) {

        // Canal novo é o mesmo canal ativador
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

                        // Permissões do bot no servidor
                        const membro_sv = await client.getMemberGuild(guild.sid, client.id())
                        if (membro_sv.permissions.has(PermissionsBitField.Flags.MoveMembers)) {

                            // Movendo o membro para o novo canal
                            guild_member.voice.setChannel(new_voice_channel.id)

                            // Atualizandos os dados do canal no banco de dados
                            user_voice_channel.cid = client.encrypt(new_voice_channel.id)
                            await user_voice_channel.save()

                            // const user = await client.getUser(id_user)

                            // Criando o embed de botões para configuração do canal pelo membro
                            // const embed = new EmbedBuilder()
                            //     .setTitle("> Controles do canal de voz")
                            //     .setDescription("Utilize os botões abaixo para definir o funcionamento deste canal dinâmico.")
                            //     .setColor(client.embed_color(user.misc.color))

                            // const row = client.create_buttons([
                            // { id: "user_voice_channel", name: "Limitar canal", type: 2, emoji: client.defaultEmoji("metrics"), data: "1" }
                            // ], id_user)

                            // client.notify(new_voice_channel.id, { content: `<@${id_user}>`, embeds: [embed], components: [row] })
                        }
                    })
                }
            } else { // Membro já criou um canal, movendo ele para o canal criado se entrar no canal ativador novamente
                const guild_member = await client.getMemberGuild(guild.sid, id_user)
                guild_member.voice.setChannel(client.decifer(user_voice.cid))
            }
        }

    } else // Verifica se o canal possui ausencia de membros
        verificar_ausencia_canal(client, oldState.channel.id, guild)
}

async function verificar_ausencia_canal(client, channel_id, guild) {

    // Dono original saiu do canal dinâmico
    const voice_channel = await verifyVoiceChannel(client.encrypt(channel_id), client.encrypt(guild.sid))

    if (voice_channel) {

        const guild_channel = await client.getGuildChannel(channel_id)

        // Excluindo o canal se estiver vazio
        if (guild_channel && guild_channel?.members?.size < 1) {
            voice_channel.delete()

            // Alterando o nome do canal para informar a exclusão
            await guild_channel.edit({
                name: `${client.emoji(13)} ${guild_channel.name.split(" ")[1]}`
            })

            // Notificando sobre a exclusão do canal no chat de mensagens
            client.notify(guild_channel.id, { content: `${client.emoji(13)} | Este canal será excluído <t:${client.timestamp() + voiceChannelTimeouts[guild.voice_channels.timeout]}:R>` })

            setTimeout(() => {
                guild_channel.delete()
            }, voiceChannelTimeouts[guild.voice_channels.timeout] * 1000)
        }
    }
}