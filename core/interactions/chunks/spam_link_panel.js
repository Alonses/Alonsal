const { EmbedBuilder } = require("discord.js")

const { getCachedSuspiciousLink } = require("../../database/schemas/Spam_link")

module.exports = async ({ client, user, interaction, dados }) => {

    const guild_sid = dados.split(".")[0]
    const timestamp = dados.split(".")[1]

    const link = await getCachedSuspiciousLink(guild_sid, timestamp)

    if (!link) // Link não encontrado
        return client.reply(interaction, {
            content: "🔍 | O link selecionado não foi encontrado!\nPor favor, tente novamente com um outro link."
        })

    const embed = new EmbedBuilder()
        .setTitle("> Navegando por links suspeitos 🔗")
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`O Link descrito abaixo foi identificado como suspeito.\`\`\`fix\n${link.link}\`\`\``)
        .setFields(
            {
                name: `${client.defaultEmoji("time")} **Identificado <t:${timestamp}:R>**`,
                value: `( <t:${timestamp}:f> )`,
                inline: false
            }
        )
        .setFooter({
            text: "Use os botões abaixo para gerenciar este link",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    const row = client.create_buttons([
        { id: "spam_link_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "2" },
        { id: "spam_link_button", name: "Remover link", type: 3, emoji: client.emoji(13), data: `5|${timestamp}` }
    ], interaction)

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [row],
        ephemeral: true
    })
}