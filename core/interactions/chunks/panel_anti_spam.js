const { EmbedBuilder } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")
const { spamTimeoutMap } = require("../../database/schemas/Strikes")

module.exports = async ({ client, user, interaction, operacao }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild" }]
    let strikes = ""

    if (guild?.spam.strikes) {
        strikes = "📜 Sistema de strikes 🔇"

        if (!guild.spam.data)
            strikes += "\n\nO sistema de strikes está ativo neste servidor! Usuários recorrentes do anti-spam serão castigados na ordem descrita abaixo.\n\n1° Ocorrência -> 2 horas\n2° Ocorrência -> 6 horas\n3° Ocorrência -> 2 dias\n4° Ocorrência -> 7 dias\n5° Ocorrência -> Expulsão"

        strikes = `\`\`\`${strikes}\`\`\`\n`
    } else
        strikes = "\`\`\`🔇 O sistema de strikes está desativado neste servidor!\n\nAtive ele para poder definir punições com tempos que se incrementam de acordo com a quantidade de infrações que promovedores de spam realizam no servidor!\`\`\`\n"

    const embed = new EmbedBuilder()
        .setTitle("> Anti-spam 📛")
        .setColor(client.embed_color(user.misc.color))
        .setFields(
            {
                name: `${emoji_button(guild?.conf.spam)} **Status**`,
                value: `${emoji_button(guild?.spam.strikes)} **Punições por níveis**\n${client.defaultEmoji("time")} **Tempo:** \`${spamTimeoutMap[guild.spam.timeout][1]}\``,
                inline: true
            },
            {
                name: "**Canal de avisos**",
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
        { id: "anti_spam_button", name: "Tempo mínimo", type: 1, emoji: client.defaultEmoji("time"), data: "3" }
    ])

    const row = client.create_buttons(botoes, interaction)

    interaction.update({
        content: "",
        embeds: [embed],
        components: [row],
        ephemeral: true
    })
}