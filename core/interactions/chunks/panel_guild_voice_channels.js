const { PermissionsBitField } = require("discord.js")

const { listAllGuildVoiceTriggers } = require("../../database/schemas/Voice_triggers")

const { voiceChannelTimeout } = require("../../formatters/patterns/timeout")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    const ativadores = (await listAllGuildVoiceTriggers(client.encrypt(interaction.guild.id))).length

    // Sem trigger criado, redirecionando para criação de um novo
    if (ativadores < 1) {

        let dados = '0.31'
        return require("../functions/buttons/guild_voice_channels_button")({ client, user, interaction, dados })
    }

    // Permissões do bot no servidor
    const membro_sv = await client.execute("getMemberGuild", { interaction, id_user: client.id() })

    const embed = client.create_embed({
        title: `> ${client.tls.phrase(user, "mode.voice_channels.title_voice")} 🔊`,
        description: { tls: "mode.voice_channels.descricao_modulo" },
        fields: [
            {
                name: `${client.execute("button_emoji", guild.conf.voice_channels)} **${client.tls.phrase(user, "mode.report.status")}**\n${client.execute("button_emoji", guild.voice_channels.preferences.mute_popup)} **${client.tls.phrase(user, "menu.botoes.mute_popup")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "menu.botoes.expiracao")}**`,
                value: `**( \`${voiceChannelTimeout[guild.voice_channels.timeout]}${client.tls.phrase(user, "util.unidades.segundos")}\` )**`,
                inline: true
            },
            {
                name: `${client.execute("button_emoji", guild.voice_channels.preferences.allow_preferences)} **${client.tls.phrase(user, "menu.botoes.customizacoes")}**`,
                value: `${client.emoji(48)} **Ativadores ( ${ativadores} / ${guild.misc.subscription.active ? 10 : 2} )**`,
                inline: true
            },
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${client.execute("button_emoji", membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels))} **${client.tls.phrase(user, "mode.network.gerenciar_canais")}**\n${client.execute("button_emoji", membro_sv.permissions.has(PermissionsBitField.Flags.Connect))} **${client.tls.phrase(user, "mode.voice_channels.conectar_canal")}**`,
                inline: true
            },
            {
                name: "⠀",
                value: `${client.execute("button_emoji", membro_sv.permissions.has(PermissionsBitField.Flags.MoveMembers))} **${client.tls.phrase(user, "mode.voice_channels.mover_membros")}**\n${client.execute("button_emoji", membro_sv.permissions.has(PermissionsBitField.Flags.Speak))} **${client.tls.phrase(user, "mode.voice_channels.falar_canal")}**`,
                inline: true
            }
        ],
        footer: {
            text: "⠀",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    let falta_permissoes = false, mute_disabled = true

    // Verificando as permissões do bot para gerenciar canais e mover membros
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) || !membro_sv.permissions.has(PermissionsBitField.Flags.MoveMembers))
        falta_permissoes = true

    // Permissões para conectar e falar em canais de voz
    if (membro_sv.permissions.has(PermissionsBitField.Flags.Connect) && membro_sv.permissions.has(PermissionsBitField.Flags.Speak))
        mute_disabled = false

    // Página de configuração gerais do canais de voz dinâmicos
    const botoes = [
        { id: "guild_voice_channels_button", name: { tls: "mode.voice_channels.faladeros" }, type: guild?.conf.voice_channels, emoji: client.execute("button_emoji", guild?.conf.voice_channels), data: "1", disabled: falta_permissoes },
        { id: "guild_voice_channels_button", name: { tls: "menu.botoes.mute_popup" }, type: guild?.voice_channels.preferences.mute_popup, emoji: client.execute("button_emoji", guild?.voice_channels.preferences.mute_popup), data: "5", disabled: mute_disabled },
        { id: "guild_voice_channels_button", name: { tls: "menu.botoes.expiracao" }, type: 0, emoji: client.defaultEmoji("time"), data: "4" },
        { id: "guild_voice_channels_button", name: { tls: "menu.botoes.customizacoes" }, type: guild?.voice_channels.preferences.allow_preferences, emoji: client.emoji(60), data: "25" }
    ]

    const row = [
        { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: "panel_guild.3" },
        { id: "guild_voice_channels_button", name: "Ativadores", type: 0, emoji: client.emoji(48), data: "30" }
    ]

    // Verificando se o usuário está conectado em um canal de voz
    if (interaction.member.voice.channel && !client.cached.voice_channels.has(`${client.encrypt(interaction.member.voice.channel.id)}.${client.encrypt(interaction.guild.id)}`, true))
        row.push({ id: "guild_voice_channels_button", name: { tls: "menu.botoes.converter_canal" }, type: 0, emoji: "👾", data: "6" })

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction, user), client.create_buttons(row, interaction, user)],
        flags: "Ephemeral"
    })
}