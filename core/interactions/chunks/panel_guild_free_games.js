const { EmbedBuilder } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.0" }]

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "manu.painel.anuncio_games")} :video_game:`)
        .setColor(client.embed_color(user.misc.color))
        .setFields(
            {
                name: `${emoji_button(guild?.conf.games)} **${client.tls.phrase(user, "mode.report.status")}**`,
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

    botoes = botoes.concat([
        { id: "guild_free_games_button", name: client.tls.phrase(user, "manu.painel.anuncio_games"), type: type_button(guild?.conf.games), emoji: emoji_button(guild?.conf.games), data: "1" },
        { id: "guild_free_games_button", name: client.tls.phrase(user, "menu.botoes.anunciar_agora"), type: 1, emoji: client.emoji(6), data: "2" },
        { id: "guild_free_games_button", name: client.tls.phrase(user, "mode.anuncio.cargo"), type: 1, emoji: client.defaultEmoji("role"), data: "3" },
        { id: "guild_free_games_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "4" }
    ])

    interaction.update({
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}