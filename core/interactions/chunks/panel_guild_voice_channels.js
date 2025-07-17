const { EmbedBuilder, PermissionsBitField } = require("discord.js")
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

    const embed = new EmbedBuilder()
        .setTitle(`> Faladeros dinâmicos 🔊`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription('```Este módulo concede a possibilidade dos membros do servidor criarem canais de voz dinâmicos ao ingressarem em um canal especifico.\n\nDefina um canal de voz padrão e uma categoria fixa, após isso, todos os membros que conectarem a este canal serão transferidos para um novo canal criado no mesmo instante na categoria selecionada, cada membro diferente que conectar no canal ativador gerará um canal separado.\n\nQuando todos os membros saírem de seus canais, os mesmos serão excluído após o tempo de expiração definido abaixo.```')
        .setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild.conf.voice_channels)} **${client.tls.phrase(user, "mode.report.status")}**\n${client.defaultEmoji("time")} **${client.tls.phrase(user, "menu.botoes.expiracao")}\n( \`${voiceChannelTimeout[guild.voice_channels.timeout]} ${client.tls.phrase(user, "util.unidades.segundos")}\` )**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **Canal ativador**`,
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
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels))} **${client.tls.phrase(user, "mode.network.gerenciar_canais")}**\n${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.MoveMembers))} **Mover membros**`,
                inline: true
            }
        )
        .setFooter({
            text: "⠀",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    let falta_permissoes = false

    // Verificando as permissões do bot para gerenciar canais e mover membros
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) || !membro_sv.permissions.has(PermissionsBitField.Flags.MoveMembers))
        falta_permissoes = true

    const botoes = [
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.3" },
        { id: "guild_voice_channels_button", name: "Faladeros", type: client.execute("functions", "emoji_button.type_button", guild?.conf.voice_channels), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.voice_channels), data: "1", disabled: falta_permissoes },
        { id: "guild_voice_channels_button", name: "Canal ativador", type: 1, emoji: client.defaultEmoji("channel"), data: "2" },
        { id: "guild_voice_channels_button", name: client.tls.phrase(user, "util.server.categoria"), type: 1, emoji: client.defaultEmoji("channel"), data: "3" },
        { id: "guild_voice_channels_button", name: client.tls.phrase(user, "menu.botoes.expiracao"), type: 1, emoji: client.defaultEmoji("time"), data: "4" }
    ]

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        flags: "Ephemeral"
    })
}