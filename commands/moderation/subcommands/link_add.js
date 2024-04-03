const { EmbedBuilder } = require("discord.js")

const { verifySuspiciousLink, registerCachedSuspiciousLink } = require("../../../core/database/schemas/Spam_link")

module.exports = async ({ client, user, interaction }) => {

    let link = `${interaction.options.getString("link")} `

    // Verificando se o link é válido
    if (!link.match(client.cached.regex))
        return client.tls.reply(interaction, user, "mode.link_suspeito.link_invalido", true, client.emoji(0))

    link = link.replace(" ", "")

    if (await verifySuspiciousLink(link, true)) // Link já existe
        return client.tls.reply(interaction, user, "mode.link_suspeito.link_ja_registrado", true, client.emoji(0))

    const timestamp = client.timestamp()
    await registerCachedSuspiciousLink(link, interaction.guild.id, timestamp)

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "mode.link_suspeito.registrando_link_titulo"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "mode.link_suspeito.registrando_link_descricao", null, link))
        .setFooter({
            text: client.tls.phrase(user, "mode.link_suspeito.rodape_opcoes"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    // Criando os botões para excluir o link suspeito
    const row = client.create_buttons([
        { id: "spam_link_button", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1.${timestamp}` },
        { id: "spam_link_button", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: `0.${timestamp}` }
    ], interaction)

    interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
    })
}