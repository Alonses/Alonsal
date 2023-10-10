const { EmbedBuilder } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")
const { spamTimeoutMap } = require("../../database/schemas/Strikes")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.2" }], strikes = ""

    if (guild?.spam.strikes) {
        strikes = client.tls.phrase(user, "mode.spam.strikes")

        if (!guild.spam.data)
            strikes += client.tls.phrase(user, "mode.spam.strikes_ativo")

        strikes = `\`\`\`${strikes}\`\`\`\n`
    } else
        strikes = client.tls.phrase(user, "mode.spam.strikes_desativado")

    const embed = new EmbedBuilder()
        .setTitle("> Anti-spam 📛")
        .setColor(client.embed_color(user.misc.color))
        .setFields(
            {
                name: `${emoji_button(guild?.conf.spam)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${emoji_button(guild?.spam.strikes)} **${client.tls.phrase(user, "mode.spam.punicoes_niveis")}**\n${client.defaultEmoji("time")} **${client.tls.phrase(user, "mode.spam.tempo")}:** \`${spamTimeoutMap[guild.spam.timeout][1]}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${client.emoji("icon_id")} \`${guild.logger.channel}\`\n( <#${guild.logger.channel}> )`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    if (strikes !== "") // Texto dos valores de strikes
        embed.setDescription(strikes)

    botoes = botoes.concat([
        { id: "anti_spam_button", name: client.tls.phrase(user, "manu.painel.anti_spam"), type: type_button(guild?.conf.spam), emoji: emoji_button(guild?.conf.spam), data: "1" },
        { id: "anti_spam_button", name: "Strikes", type: type_button(guild?.spam.strikes), emoji: emoji_button(guild?.spam.strikes), data: "2" },
        { id: "anti_spam_button", name: client.tls.phrase(user, "mode.spam.tempo_minimo"), type: 1, emoji: client.defaultEmoji("time"), data: "3" },
        { id: "anti_spam_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "4" }
    ])

    interaction.update({
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}