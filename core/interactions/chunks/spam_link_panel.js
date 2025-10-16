const { getCachedSuspiciousLink } = require("../../database/schemas/Spam_links")

module.exports = async ({ client, user, interaction, dados }) => {

    const timestamp = dados.split(".")[1]
    const pagina = parseInt(dados.split(".")[2])
    const link = await getCachedSuspiciousLink(timestamp)

    if (!link) // Link não encontrado
        return client.reply(interaction, {
            content: client.tls.phrase(user, "mode.link_suspeito.link_nao_encontrado", 1)
        })

    const embed = client.create_embed({
        title: { tls: "mode.link_suspeito.titulo" },
        description: { tls: "mode.link_suspeito.descricao_link", replace: client.decifer(link.link) },
        fields: [
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "mode.link_suspeito.identificado")} <t:${timestamp}:R>**`,
                value: `( <t:${timestamp}:f> )`,
                inline: false
            }
        ],
        footer: {
            text: { tls: "mode.link_suspeito.rodape_dica" },
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    const row = client.create_buttons([
        { id: "spam_link_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: `2.${pagina}` },
        { id: "spam_link_button", name: { tls: "menu.botoes.remover_link" }, type: 3, emoji: client.emoji(13), data: `5|${timestamp}` }
    ], interaction, user)

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}