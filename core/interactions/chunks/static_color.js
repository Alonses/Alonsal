const { colorsMap, colorsPriceMap } = require('../../formatters/patterns/user')

module.exports = async ({ client, user, interaction, valor }) => {

    let entrada = interaction.options?.getString("color") || valor

    if (user.misc.embed_color === colorsMap[entrada][1])
        return client.tls.reply(interaction, user, "misc.color.cor_ativa", true, 7)

    let cor_demonstracao = entrada === "random" ? client.embed_color("RANDOM") : colorsMap[entrada][0]
    let nota_cor_aleatoria = ""

    if (entrada === "random")
        nota_cor_aleatoria = `\n:rainbow: ${client.tls.phrase(user, "misc.color.rand_color")}`

    // Enviando o embed para validação
    const embed = client.create_embed({
        title: { tls: "misc.color.titulo" },
        color: cor_demonstracao,
        thumbnail: interaction.user.avatarURL({ dynamic: true }),
        description: `${client.tls.phrase(user, "misc.color.descricao")}${nota_cor_aleatoria}`,
        fields: [
            {
                name: `:money_with_wings: **${client.tls.phrase(user, "misc.color.preco")}**`,
                value: `\`B$ ${client.cached.subscribers.has(user.uid) ? `${colorsPriceMap[colorsMap[entrada][1]] * client.cached.subscriber_discount} (${client.execute("getSubscriberDiscount")}% OFF 🌟)` : colorsPriceMap[colorsMap[entrada][1]]}\``,
                inline: false
            }
        ],
        footer: {
            text: { tls: "misc.color.footer" },
            iconURL: client.avatar()
        }
    }, user)

    // Criando os botões para a cor customizada
    const row = client.create_buttons([
        { id: "user_custom_color", name: { tls: "menu.botoes.confirmar" }, type: 1, emoji: client.emoji(10), data: `1|${entrada}` },
        { id: "user_custom_color", name: { tls: "menu.botoes.escolher_cor" }, type: 0, emoji: client.defaultEmoji("pen"), data: `2|${entrada}` },
        { id: "user_custom_color", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: 0 }
    ], interaction, user)

    client.reply(interaction, {
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}