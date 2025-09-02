const { PermissionsBitField } = require("discord.js")

const { voiceChannelTimeout } = require("../../formatters/patterns/timeout")
const { voice_names } = require("../../formatters/patterns/guild")

module.exports = async ({ client, user, interaction, pagina_guia }) => {

    const guild = await client.getGuild(interaction.guild.id), pagina = pagina_guia || 0

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
                name: `${client.execute("functions", "emoji_button.emoji_button", guild.conf.voice_channels)} **${client.tls.phrase(user, "mode.report.status")}**\n${client.execute("functions", "emoji_button.emoji_button", guild.voice_channels.preferences.mute_popup)} **${client.tls.phrase(user, "menu.botoes.mute_popup")}**\n${client.defaultEmoji("time")} **${client.tls.phrase(user, "menu.botoes.expiracao")}\n( \`${voiceChannelTimeout[guild.voice_channels.timeout]}${client.tls.phrase(user, "util.unidades.segundos")}\` )**`,
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

    if (pagina === 1) {
        embed.setDescription(client.tls.phrase(user, "mode.voice_channels.descricao_edicao_canais"))
        embed.setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild.voice_channels.preferences.always_private)} ${client.tls.phrase(user, "menu.botoes.sempre_privado")}\n${guild?.voice_channels.preferences.user_limit < 1 ? "🗽" : "🚧"} ${client.tls.phrase(user, "mode.voice_channels.limite_usuarios")}`,
                value: guild.voice_channels.preferences.user_limit < 1 ? `\`${client.tls.phrase(user, "util.canal.sem_limite")}\`` : `\`${guild.voice_channels.preferences.user_limit} ${client.tls.phrase(user, "mode.voice_channels.usuarios")}\``,
                inline: true
            },
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild.voice_channels.preferences.allow_text)} ${client.tls.phrase(user, "menu.botoes.permitir_texto")}\n${client.emoji("mc_name_tag")} ${client.tls.phrase(user, "mode.voice_channels.temas_nomes")}`,
                value: `\`${voice_names[guild.voice_channels.preferences.voice_names]} ${client.tls.phrase(user, `mode.voice_channels.nicknames.${guild.voice_channels.preferences.voice_names}`)}\``,
                inline: true
            },
            // {
            //     name: `${client.execute("functions", "emoji_button.emoji_button", guild.voice_channels.preferences.allow_preferences)} **${client.tls.phrase(user, "menu.botoes.preferencias")}**`,
            //     value: "⠀",
            //     inline: true
            // }
        )
    }

    let falta_permissoes = false

    // Verificando as permissões do bot para gerenciar canais e mover membros
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) || !membro_sv.permissions.has(PermissionsBitField.Flags.MoveMembers))
        falta_permissoes = true

    let botoes = []

    if (pagina === 0) // Página de configuração do canais de voz dinâmicos
        botoes.push(
            { id: "guild_voice_channels_button", name: { tls: "mode.voice_channels.faladeros" }, type: client.execute("functions", "emoji_button.type_button", guild?.conf.voice_channels), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.voice_channels), data: "1", disabled: falta_permissoes },
            { id: "guild_voice_channels_button", name: { tls: "mode.voice_channels.canal_ativador" }, type: 1, emoji: client.defaultEmoji("channel"), data: "2" },
            { id: "guild_voice_channels_button", name: { tls: "util.server.categoria" }, type: 1, emoji: client.defaultEmoji("channel"), data: "3" },
            { id: "guild_voice_channels_button", name: { tls: "menu.botoes.expiracao" }, type: 1, emoji: client.defaultEmoji("time"), data: "4" }
        )
    else // Página de customização extras dos canais de voz do servidor
        botoes.push(
            { id: "guild_voice_channels_button", name: { tls: "mode.voice_channels.limite_usuarios" }, type: 1, emoji: guild.voice_channels.preferences.voice_channels < 1 ? "🗽" : "🚧", data: "21" },
            { id: "guild_voice_channels_button", name: { tls: "menu.botoes.sempre_privado" }, type: client.execute("functions", "emoji_button.type_button", guild?.voice_channels.preferences.always_private), emoji: client.emoji(18), data: "22" },
            { id: "guild_voice_channels_button", name: { tls: "menu.botoes.nomes" }, type: 1, emoji: client.emoji("mc_name_tag"), data: "23" },
            { id: "guild_voice_channels_button", name: { tls: "menu.botoes.permitir_texto" }, type: client.execute("functions", "emoji_button.type_button", guild?.voice_channels.preferences.allow_text), emoji: client.emoji(31), data: "24" },
            // { id: "guild_voice_channels_button", name: { tls: "menu.botoes.preferencias" }, type: client.execute("functions", "emoji_button.type_button", guild?.voice_channels.preferences.allow_preferences), emoji: client.emoji("mc_writable_book"), data: "25" }
        )

    const row = [{ id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: pagina === 0 ? "panel_guild.3" : "panel_guild_voice_channels" }]
    let mute_disabled = true

    // Permissões para conectar e falar em canais de voz
    if (membro_sv.permissions.has(PermissionsBitField.Flags.Connect) && membro_sv.permissions.has(PermissionsBitField.Flags.Speak) && pagina === 0) {
        mute_disabled = false
        row.push({ id: "guild_voice_channels_button", name: { tls: "menu.botoes.mute_popup" }, type: client.execute("functions", "emoji_button.type_button", guild?.voice_channels.preferences.mute_popup), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.voice_channels.preferences.mute_popup), data: "5", disabled: mute_disabled })
    }

    if (pagina === 0) // Página de ajustes dos canais de voz dinâmicos
        row.push({ id: "guild_voice_channels_button", name: { tls: "menu.botoes.ajustes" }, type: 1, emoji: client.emoji(41), data: "20" })

    // Verificando se o usuário está conectado em um canal de voz
    if (interaction.member.voice.channel && !client.cached.voice_channels.has(`${client.encrypt(interaction.member.voice.channel.id)}.${client.encrypt(interaction.guild.id)}`, true))
        row.push({ id: "guild_voice_channels_button", name: { tls: "menu.botoes.converter_canal" }, type: 1, emoji: "👾", data: "6" })

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction, user), client.create_buttons(row, interaction, user)],
        flags: "Ephemeral"
    })
}