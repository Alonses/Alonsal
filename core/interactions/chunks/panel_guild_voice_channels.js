const { PermissionsBitField } = require("discord.js")

const { voiceChannelTimeout } = require("../../formatters/patterns/timeout")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)

    // Sem canal ou categoria definidos
    if (!guild.voice_channels.channel || !guild.voice_channels.category) {

        let dados = `${interaction.user.id}.0`
        return require("../functions/buttons/guild_voice_channels_button")({ client, user, interaction, dados })
    }

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())

    const embed = client.create_embed({
        title: `> ${client.tls.phrase(user, "mode.voice_channels.title_voice")} 🔊`,
        description: { tls: "mode.voice_channels.descricao_modulo" },
        fields: [
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild.conf.voice_channels)} **${client.tls.phrase(user, "mode.report.status")}**\n${client.execute("functions", "emoji_button.emoji_button", guild.voice_channels.mute_popup)} **${client.tls.phrase(user, "menu.botoes.mute_popup")}**\n${client.defaultEmoji("time")} **${client.tls.phrase(user, "menu.botoes.expiracao")}\n( \`${voiceChannelTimeout[guild.voice_channels.timeout]}${client.tls.phrase(user, "util.unidades.segundos")}\` )**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.voice_channels.canal_ativador")}**`,
                value: `${guild.voice_channels.channel ? `${client.emoji("icon_id")} \`${client.decifer(guild.voice_channels.channel)}\`\n( <#${client.decifer(guild.voice_channels.channel)}> )` : `\`❌ ${client.tls.phrase(user, "mode.network.sem_canal")}\``}`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "util.server.categoria")}**`,
                value: `${client.emoji("icon_id")} \`${client.decifer(guild.voice_channels.category)}\`\n( <#${client.decifer(guild.voice_channels.category)}> )`,
                inline: true
            },
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels))} **${client.tls.phrase(user, "mode.network.gerenciar_canais")}**\n${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.Connect))} **${client.tls.phrase(user, "mode.voice_channels.conectar_canal")}**`,
                inline: true
            },
            {
                name: "⠀",
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.MoveMembers))} **${client.tls.phrase(user, "mode.voice_channels.mover_membros")}**\n${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.Speak))} **${client.tls.phrase(user, "mode.voice_channels.falar_canal")}**`,
                inline: true
            }
        ],
        footer: {
            text: "⠀",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    let falta_permissoes = false

    // Verificando as permissões do bot para gerenciar canais e mover membros
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) || !membro_sv.permissions.has(PermissionsBitField.Flags.MoveMembers))
        falta_permissoes = true

    const botoes = [
        { id: "guild_voice_channels_button", name: { tls: "mode.voice_channels.faladeros", alvo: user }, type: client.execute("functions", "emoji_button.type_button", guild?.conf.voice_channels), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.voice_channels), data: "1", disabled: falta_permissoes },
        { id: "guild_voice_channels_button", name: { tls: "mode.voice_channels.canal_ativador", alvo: user }, type: 1, emoji: client.defaultEmoji("channel"), data: "2" },
        { id: "guild_voice_channels_button", name: { tls: "util.server.categoria", alvo: user }, type: 1, emoji: client.defaultEmoji("channel"), data: "3" },
        { id: "guild_voice_channels_button", name: { tls: "menu.botoes.expiracao", alvo: user }, type: 1, emoji: client.defaultEmoji("time"), data: "4" }
    ]

    const row = [{ id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: "panel_guild.3" }]
    let mute_disabled = true

    // Permissões para conectar e falar em canais de voz
    if (membro_sv.permissions.has(PermissionsBitField.Flags.Connect) && membro_sv.permissions.has(PermissionsBitField.Flags.Speak)) {
        mute_disabled = false
        row.push({ id: "guild_voice_channels_button", name: { tls: "menu.botoes.mute_popup", alvo: user }, type: client.execute("functions", "emoji_button.type_button", guild?.voice_channels.mute_popup), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.voice_channels.mute_popup), data: "5", disabled: mute_disabled })
    }

    // Verificando se o usuário está conectado em um canal de voz
    if (interaction.member.voice.channel && !client.cached.voice_channels.has(`${client.encrypt(interaction.member.voice.channel.id)}.${client.encrypt(interaction.guild.id)}`, true))
        row.push({ id: "guild_voice_channels_button", name: { tls: "menu.botoes.converter_canal", alvo: user }, type: 1, emoji: "👾", data: "6" })

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction), client.create_buttons(row, interaction)],
        flags: "Ephemeral"
    })
}