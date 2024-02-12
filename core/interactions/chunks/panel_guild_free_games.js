const { EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.1" }]

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "manu.painel.anuncio_games")} :video_game:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "mode.anuncio.descricao"))
        .setFields(
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
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())
    let b_cargos = false

    embed.addFields(
        {
            name: `${client.emoji(7)} **Permissões neste servidor**`,
            value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))} **Gerenciar cargos**`,
            inline: true
        },
        {
            name: "⠀",
            value: "⠀",
            inline: true
        },
        {
            name: "⠀",
            value: "⠀",
            inline: true
        }
    )

    // Desabilitando o botão de escolher cargos
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        b_cargos = true

        embed.setFooter({
            text: `Não é possível definir um cargo para o anúncio sem a permissão de "Gerenciar cargos" concedida.`,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })
    }

    botoes = botoes.concat([
        { id: "guild_free_games_button", name: client.tls.phrase(user, "manu.painel.anuncio_games"), type: client.execute("functions", "emoji_button.type_button", guild?.conf.games), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.games), data: "1" },
        { id: "guild_free_games_button", name: client.tls.phrase(user, "mode.anuncio.cargo"), type: 1, emoji: client.defaultEmoji("role"), data: "3", disabled: b_cargos },
        { id: "guild_free_games_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "4" }
    ])

    // Mostrado apenas quando um canal e um cargo está definido para o anúncio de games do servidor
    if (guild.games.channel && guild.games.role)
        botoes = botoes.concat([
            { id: "guild_free_games_button", name: client.tls.phrase(user, "menu.botoes.anunciar_agora"), type: 1, emoji: client.emoji(6), data: "2" }
        ])

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}