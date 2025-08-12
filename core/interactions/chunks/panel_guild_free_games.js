const { PermissionsBitField } = require("discord.js")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = []

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())
    let b_cargos = false

    const embed = client.create_embed({
        title: `> ${client.tls.phrase(user, "manu.painel.anuncio_games")} :video_game:`,
        description: { tls: "mode.anuncio.descricao" },
        fields: [
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.games)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `:label: **${client.tls.phrase(user, "mode.anuncio.cargo")}**`,
                value: `${client.emoji("icon_id")} \`${guild.games.role}\`\n( <@&${guild.games.role}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${client.emoji("icon_id")} \`${guild.games.channel}\`\n( <#${guild.games.channel}> )`,
                inline: true
            },
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))} **${client.tls.phrase(user, "mode.network.gerenciar_cargos")}**`,
                inline: false
            }
        ],
        footer: {
            text: { tls: "manu.painel.rodape" },
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    // Desabilitando o botão de escolher cargos
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        b_cargos = true

        embed.setFooter({
            text: client.tls.phrase(user, "mode.network.falta_permissao"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })
    }

    botoes.push(
        { id: "guild_free_games_button", name: { tls: "manu.painel.anuncio_games", alvo: user }, type: client.execute("functions", "emoji_button.type_button", guild?.conf.games), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.games), data: "1" },
        { id: "guild_free_games_button", name: { tls: "mode.anuncio.cargo", alvo: user }, type: 1, emoji: client.defaultEmoji("role"), data: "3", disabled: b_cargos },
        { id: "guild_free_games_button", name: { tls: "mode.report.canal_de_avisos", alvo: user }, type: 1, emoji: client.defaultEmoji("channel"), data: "4" }
    )

    if (guild.games.channel && guild.games.role) // Mostrado apenas quando um canal e um cargo está definido para o anúncio de games no servidor
        botoes.push({ id: "guild_free_games_button", name: { tls: "menu.botoes.anunciar_agora", alvo: user }, type: 1, emoji: client.emoji(6), data: "2" })

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction), client.create_buttons([{ id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: "panel_guild.1" }], interaction)],
        flags: "Ephemeral"
    })
}