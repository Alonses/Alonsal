const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { verifyVoiceChannel } = require("../../database/schemas/User_voice_channel")

module.exports = async ({ client, user, interaction, dados, update, new_owner }) => {

    const id_canal = dados.split(".")[0]
    const id_guild = dados.split(".")[1]
    const canal_guild = await client.getGuildChannel(interaction?.channel.id || id_canal)
    const voice_channel = await verifyVoiceChannel(client.encrypt(interaction?.channel.id || id_canal), client.encrypt(interaction?.guild.id || id_guild))

    // Alterando o dono do canal de voz
    if (new_owner) voice_channel.uid = client.encrypt(new_owner)

    if (!update) {

        // Enviando a mensagem e salvando o ID dela para atualizações futuras
        const obj = await gera_painel(client, user, id_canal, canal_guild, voice_channel)
        envia_painel(client, user, interaction, voice_channel, canal_guild, obj)
            .catch({})

    } else {

        // Atualizando a mensagem original com o painel de controle do canal de voz
        canal_guild.messages.fetch(client.decifer(voice_channel.mid))
            .then(async (m) => { m.edit(await gera_painel(client, user, id_canal, canal_guild, voice_channel)) })
            .catch(async () => {
                const obj = await gera_painel(client, user, id_canal, canal_guild, voice_channel)
                envia_painel(client, user, interaction, voice_channel, canal_guild, obj)
                    .catch({})
            })
    }
}

async function gera_painel(client, user, id_canal, canal_guild, voice_channel) {

    let aviso_card = "", users_liberados = []
    const botoes = [
        { id: "user_voice_channel", name: client.tls.phrase(user, "menu.botoes.limitar_canal"), type: 1, emoji: client.defaultEmoji("metrics"), data: `1.${id_canal}.${client.decifer(voice_channel.uid)}` },
        { id: "user_voice_channel", name: "Privar canal", type: 1, emoji: "🔒", data: `2.${id_canal}.${client.decifer(voice_channel.uid)}` }
    ]

    // Botões para (des)privar o canal de voz
    if (!canal_guild.permissionsFor(canal_guild.guild.id).has(PermissionsBitField.Flags.ViewChannel)) {

        botoes.push({ id: "user_voice_channel", name: "Tornar público", type: 3, emoji: "🔒", data: `3.${id_canal}.${client.decifer(voice_channel.uid)}` })

        canal_guild.permissionOverwrites.cache.forEach(permissao => {
            if (permissao != canal_guild.guild.id && permissao != client.id())
                users_liberados.push(`<@${permissao.id}>`)
        })

        aviso_card = `\`\`\`🐱‍👤 Este canal se encontra privado no momento\`\`\`\n:passport_control: **Usuários com acesso ao canal:**\n${users_liberados.join(", ")}\n\n\n`
    }

    if (voice_channel.conf.mute) {

        aviso_card += `\`\`\`🔈 Restrição de voz ativada.\`\`\`\n`

        botoes.unshift({ id: "user_voice_channel", name: "🔈", type: 3, emoji: client.emoji("jacquin2"), data: `6.${id_canal}` })
    } else
        botoes.unshift({ id: "user_voice_channel", name: "🔊", type: 0, emoji: client.emoji("fabio"), data: `5.${id_canal}` })

    // Criando o embed de botões para configuração do canal pelo membro
    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.voice_channels.titulo_controle_canal", null, canal_guild.name.split(" ")[1])} 🔊`)
        .setDescription(`\`\`\`${client.tls.phrase(user, "mode.voice_channels.painel_configuracao_canal")}\`\`\`${aviso_card}`)
        .setColor(client.embed_color(user.misc.color))
        .setFields(
            {
                name: `${canal_guild.userLimit < 1 ? "🗽" : "🚧"} **${client.tls.phrase(user, "mode.voice_channels.limite_usuarios")}**`,
                value: canal_guild.userLimit < 1 ? `\`${client.tls.phrase(user, "util.canal.sem_limite")}\`` : `\`${canal_guild.userLimit} ${client.tls.phrase(user, "mode.voice_channels.usuarios")}\``,
                inline: true
            },
            {
                name: `:unicorn: **${client.tls.phrase(user, "util.server.dono")}**`,
                value: `<@${client.decifer(voice_channel.uid)}>`,
                inline: true
            }
        )

    const row = client.create_buttons(botoes, client.decifer(voice_channel.uid))

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
            await voice_channel.save()

            if (interaction)
                client.tls.reply(interaction, user, "mode.voice_channels.dados_perdidos", true, 70)
        })
}