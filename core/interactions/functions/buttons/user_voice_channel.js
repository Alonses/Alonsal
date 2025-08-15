const { PermissionsBitField } = require("discord.js")

const { verifyVoiceChannel } = require("../../../database/schemas/User_voice_channel")
const { conecta_canal_voz } = require("../../../auto/voice_connect")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_canal = dados.split(".")[2]
    const escolha = parseInt(dados.split(".")[1])

    // Tratamento dos cliques
    // 1 -> Definir limite para o canal
    // 2 -> Tornar o canal privado
    // 3 -> Tornar o canal público

    // 5 & 6 -> Mutar e desmutar o canal

    const voice_channel = await verifyVoiceChannel(client.encrypt(id_canal), client.encrypt(interaction.guild.id))

    if (!voice_channel)
        return client.tls.reply(interaction, user, "mode.voice_channels.canal_desconhecido", true, 1)

    if (interaction.user.id !== client.decifer(voice_channel.uid))
        return client.tls.reply(interaction, user, "mode.voice_channels.usuario_proibido", true, 7)

    // Botão para retornar ao painel de configuração do canal de voz
    const row = client.create_buttons([
        { id: "user_voice_channel", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: `0.${id_canal}` }
    ], interaction)

    if (escolha === 1) {

        // Definindo o limite de membros para o canal
        const guild_channel = await client.getGuildChannel(id_canal)
        let limite_canal = []

        for (let i = 2; i <= 20; i++) {
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

        // Atualizando a mensagem original com o painel de controle do canal de voz
        return interaction.update({
            components: [client.create_menus({ interaction, user, data }), row]
        })

    } else if (escolha === 2) {

        // Limitando os membros que podem acessar o canal
        const data = {
            title: { tls: "menu.menus.escolher_usuario" },
            pattern: "users",
            alvo: "user_voice_channel_private"
        }

        return interaction.update({
            components: [client.create_menus({ interaction, user, data }), row]
        })

    } else if (escolha === 3) {

        // Liberando o canal para todos os membros poderem ver novamente
        const guild_channel = await client.getGuildChannel(id_canal)

        if (guild_channel)
            guild_channel.permissionOverwrites.set([
                {
                    id: interaction.guild.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }])
                .then(() => {

                    // Informando ao usuário sobre a alteração do limite de membros do canal concluída
                    client.tls.reply(interaction, user, "mode.voice_channels.canal_publico", true, client.emoji("dancando_polishcow"))

                    dados = id_canal
                    const update = true
                    return require("../../chunks/voice_channel_config")({ client, user, interaction, dados, update })
                })
                .catch()

        return

    } else if (escolha === 5 || escolha === 6) {

        // (Des)mutando os membros do canal
        const guild_channel = await client.getGuildChannel(id_canal)
        const guild = await client.getGuild(interaction.guild.id)

        if (escolha === 5 && guild.voice_channels.mute_popup) { // Enviando um som no canal mutado

            const num = client.random(client.countFiles("./files/songs/voice_channel", "ogg") - 1)
            conecta_canal_voz(guild_channel, `./files/songs/voice_channel/mute_${num}.ogg`)
        }

        if (guild_channel)
            guild_channel.members.forEach(membro => {

                if (membro.user.id !== client.decifer(voice_channel.uid) && membro.user.id !== client.id())
                    membro.voice.setMute(escolha === 5 ? true : false)
                        .catch()
            })

        // Salvando o status de mute do canal
        voice_channel.conf.mute = escolha === 5 ? true : false
        await voice_channel.save()

        const frase_retorno = escolha === 5 ? client.tls.phrase(user, "mode.voice_channels.canal_mutado") : client.tls.phrase(user, "mode.voice_channels.canal_desmutado")

        // Informando ao usuário sobre a restrição de fala alterada
        interaction.reply({ content: `${client.emoji("jacquin2")} | ${frase_retorno}`, flags: "Ephemeral" })

        dados = id_canal
        const update = true
        return require("../../chunks/voice_channel_config")({ client, user, interaction, dados, update })
    }

    client.tls.reply(interaction, user, "menu.botoes.operacao_cancelada", true, 4)

    dados = id_canal
    const update = true
    require("../../chunks/voice_channel_config")({ client, user, interaction, dados, update })
}