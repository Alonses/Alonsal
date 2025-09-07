const { PermissionsBitField } = require("discord.js")

const { verifyVoiceChannel } = require("../../database/schemas/User_voice_channel")

module.exports = async ({ client, user, interaction, dados, update }) => {

    const id_canal = interaction?.channel.id || dados.split(".")[0]
    const id_guild = interaction?.guild.id || dados.split(".")[1]
    const canal_guild = await client.getGuildChannel(id_canal)
    const voice_channel = await verifyVoiceChannel(client.encrypt(id_canal), client.encrypt(id_guild))
    const guild = await client.getGuild(id_guild)

    // Verificando se o canal de voz existe no banco ainda
    if (!voice_channel) return

    if (!update) {

        // Enviando a mensagem e salvando o ID dela para atualizações futuras
        const obj = await gera_painel(client, user, guild, id_canal, canal_guild, voice_channel)
        envia_painel(client, user, interaction, voice_channel, canal_guild, obj)
            .catch({})

    } else {

        // Validando se o autor da mensagem com o card do canal é o mesmo bot
        if (client.decifer(voice_channel.bit) !== client.id()) return

        // Atualizando a mensagem original com o painel de controle do canal de voz
        canal_guild.messages.fetch(client.decifer(voice_channel.mid))
            .then(async (m) => { m.edit(await gera_painel(client, user, guild, id_canal, canal_guild, voice_channel)) })
            .catch(async () => {
                const obj = await gera_painel(client, user, guild, id_canal, canal_guild, voice_channel)
                envia_painel(client, user, interaction, voice_channel, canal_guild, obj)
                    .catch({})
            })
    }
}

async function gera_painel(client, user, guild, id_canal, canal_guild, voice_channel) {

    let aviso_card = "", users_liberados = [`<@${client.decifer(user.uid)}>`]
    const botoes = [
        { id: "user_voice_channel", name: { tls: "menu.botoes.limitar_canal" }, type: 1, emoji: client.defaultEmoji("metrics"), data: `1.${id_canal}.${client.decifer(voice_channel.uid)}` },
        { id: "user_voice_channel", name: { tls: "menu.botoes.privar_canal" }, type: 1, emoji: "🔒", data: `2.${id_canal}.${client.decifer(voice_channel.uid)}` }
    ]

    // Botões para (des)privar o canal de voz
    if (!canal_guild.permissionsFor(canal_guild.guild.id).has(PermissionsBitField.Flags.ViewChannel)) {

        botoes.push({ id: "user_voice_channel", name: { tls: "menu.botoes.tornar_publico" }, type: 2, emoji: "🔓", data: `3.${id_canal}.${client.decifer(voice_channel.uid)}` })

        canal_guild.permissionOverwrites.cache.forEach(permissao => {
            if (permissao.id != canal_guild.guild.id && permissao.id !== client.id() && permissao.id !== client.decifer(user.uid))
                users_liberados.push(`<@${permissao.id}>`)
        })

        aviso_card = client.tls.phrase(user, "mode.voice_channels.canal_privado", null, [users_liberados.length, client.list(users_liberados, null, true)])
    }

    if (voice_channel.conf.mute) {

        aviso_card += `\`\`\`${client.tls.phrase(user, "mode.voice_channels.restricao_voz_ativa")}\`\`\`\n`

        botoes.unshift({ id: "user_voice_channel", name: { tls: "menu.botoes.desmutar" }, type: 3, emoji: client.emoji("fabio"), data: `6.${id_canal}` })
    } else
        botoes.unshift({ id: "user_voice_channel", name: { tls: "menu.botoes.mutar" }, type: 0, emoji: client.emoji("jacquin2"), data: `5.${id_canal}` })

    // Criando o embed de botões para configuração do canal pelo membro
    const embed = client.create_embed({
        title: `${client.tls.phrase(user, "mode.voice_channels.titulo_controle_canal", null, canal_guild.name.split(" ")[1])} 🔊`,
        description: `\`\`\`${client.tls.phrase(user, "mode.voice_channels.painel_configuracao_canal")}\`\`\`${aviso_card}`,
        fields: [
            {
                name: `${canal_guild.userLimit < 1 ? "🗽" : "🚧"} **${client.tls.phrase(user, "mode.voice_channels.limite_usuarios")}**`,
                value: canal_guild.userLimit < 1 ? `\`${client.tls.phrase(user, "util.canal.sem_limite")}\`` : `\`${canal_guild.userLimit} ${client.tls.phrase(user, "mode.voice_channels.usuarios")}\``,
                inline: true
            },
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild.voice_channels.preferences.allow_text)} ${client.tls.phrase(user, "menu.botoes.permitir_texto")}`,
                value: "⠀",
                inline: true
            },
            {
                name: `:unicorn: **${client.tls.phrase(user, "util.server.dono")}**`,
                value: `<@${client.decifer(voice_channel.uid)}>`,
                inline: true
            }
        ]
    }, user)

    const row = client.create_buttons(botoes, client.decifer(voice_channel.uid), user)

    const obj = {
        content: `<@${client.decifer(voice_channel.uid)}>`,
        embeds: [embed],
        components: [row]
    }

    return obj
}

async function envia_painel(client, user, interaction, voice_channel, canal_guild, obj) {

    canal_guild.send(obj)
        .then(async (message) => {

            voice_channel.mid = client.encrypt(message.id)
            voice_channel.bit = client.encrypt(client.id())
            await voice_channel.save()

            if (interaction)
                client.tls.reply(interaction, user, "mode.voice_channels.dados_perdidos", true, 70)
        })
}