const { EmbedBuilder } = require("discord.js")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.2" }]

    const canais_limitados = guild.speaker.channels ? `${guild.speaker.channels.split(";").length} ${client.tls.phrase(user, "dive.speaker.canais_permitidos")}` : client.tls.phrase(user, "dive.speaker.sem_canal")

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "manu.painel.alonsal_falador")} ${client.emoji(52)}`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "dive.speaker.descricao"))
        .setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.conversation)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.speaker.regional_limit)} **${client.tls.phrase(user, "dive.speaker.limitar_canais")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "util.server.canais")}**`,
                value: `${client.defaultEmoji("metrics")} \`${canais_limitados}\``,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    botoes = botoes.concat([
        { id: "guild_speaker_button", name: client.tls.phrase(user, "manu.painel.alonsal_falador"), type: client.execute("functions", "emoji_button.type_button", guild?.conf.conversation), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.conversation), data: "1" },
        { id: "guild_speaker_button", name: client.tls.phrase(user, "dive.speaker.limitar_canais"), type: client.execute("functions", "emoji_button.type_button", guild?.speaker.regional_limit), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.speaker.regional_limit), data: "2" },
        { id: "guild_speaker_button", name: client.tls.phrase(user, "dive.speaker.canais_conversacao"), type: 1, emoji: client.defaultEmoji("channel"), data: "3" }
    ])

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}